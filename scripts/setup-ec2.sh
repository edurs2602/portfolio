#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# EC2 First-Run Setup Script
# Run this ONCE via SSH after `terraform apply` and DNS is configured:
#   ssh -i ~/.ssh/<key>.pem ec2-user@<ELASTIC_IP>
#   bash setup-ec2.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config — edit these before running ───────────────────────────────────────
ECR_REGISTRY="${ECR_REGISTRY:?Set ECR_REGISTRY env var. Ex: 123456789.dkr.ecr.us-east-1.amazonaws.com}"
ECR_FRONTEND_URL="${ECR_FRONTEND_URL:?Set ECR_FRONTEND_URL env var}"
ECR_BACKEND_URL="${ECR_BACKEND_URL:?Set ECR_BACKEND_URL env var}"
DOMAIN="${DOMAIN:-luiseduardo.dev.br}"
EMAIL="${EMAIL:-contato@luiseduardo.dev.br}"
AWS_REGION="${AWS_REGION:-us-east-1}"

APP_DIR="/opt/portfolio"

echo "──────────────────────────────────────────"
echo " Portfolio EC2 Setup"
echo " Domain: $DOMAIN"
echo " ECR:    $ECR_REGISTRY"
echo "──────────────────────────────────────────"

# ── 1. Wait for cloud-init (bootstrap) to finish ─────────────────────────────
echo "[1/9] Waiting for system bootstrap..."
while [ ! -f /var/log/bootstrap.log ]; do sleep 3; done
echo "  Bootstrap complete."

# ── 2. Clone or update repo ──────────────────────────────────────────────────
echo "[2/9] Setting up app directory..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  sudo mkdir -p "$APP_DIR"
  sudo chown ec2-user:ec2-user "$APP_DIR"
  git clone https://github.com/edurs2602/portfolio.git "$APP_DIR"
  cd "$APP_DIR"
fi

# ── 3. Create backend .env ───────────────────────────────────────────────────
echo "[3/9] Creating backend .env..."
if [ ! -f "$APP_DIR/backend/.env" ]; then
  mkdir -p "$APP_DIR/backend"
  cat > "$APP_DIR/backend/.env" <<ENVFILE
DATABASE_URL=sqlite:////app/data/portfolio.db
JWT_SECRET=$(openssl rand -hex 32)
ADMIN_USER=admin
ADMIN_PASSWORD=$(openssl rand -hex 16)
SMTP_HOST=mail.${DOMAIN}
SMTP_PORT=587
SMTP_USER=contato@${DOMAIN}
SMTP_PASSWORD=CHANGE_ME
CONTACT_EMAIL=contato@${DOMAIN}
ALLOWED_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}
TRUSTED_HOSTS=${DOMAIN},www.${DOMAIN}
HIDE_DOCS=true
CONTACT_RATE_LIMIT=3/minute
LOGIN_RATE_LIMIT=5/minute
GLOBAL_RATE_LIMIT=60/minute
ENVFILE
  chmod 600 "$APP_DIR/backend/.env"
  echo "  ⚠  Edit $APP_DIR/backend/.env and set SMTP_PASSWORD + ADMIN_PASSWORD before continuing!"
  echo "  Press ENTER when ready..."
  read -r
fi

# ── 4. Login to ECR ──────────────────────────────────────────────────────────
echo "[4/9] Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# ── 5. Set ECR env vars and pull images ──────────────────────────────────────
echo "[5/9] Pulling Docker images from ECR..."
export ECR_FRONTEND_URL ECR_BACKEND_URL
docker compose -f "$APP_DIR/docker-compose.prod.yml" pull frontend backend

# ── 6. Obtain initial Let's Encrypt certificate ───────────────────────────────
echo "[6/9] Obtaining SSL certificate..."

# Create certbot volumes
docker volume create portfolio_certbot-etc 2>/dev/null || true
docker volume create portfolio_certbot-www 2>/dev/null || true

# Temporarily serve on port 80 for ACME challenge
# Use a minimal nginx for the challenge only
docker run -d --name nginx-temp \
  -p 80:80 \
  -v portfolio_certbot-www:/var/www/certbot \
  -v "$APP_DIR/nginx.prod.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:alpine || true

sleep 2

docker run --rm \
  -v portfolio_certbot-etc:/etc/letsencrypt \
  -v portfolio_certbot-www:/var/www/certbot \
  certbot/certbot certonly \
    --webroot -w /var/www/certbot \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos --no-eff-email --non-interactive

docker stop nginx-temp && docker rm nginx-temp || true

echo "  SSL certificate obtained!"

# ── 7. Start all services ────────────────────────────────────────────────────
echo "[7/9] Starting all services..."
cd "$APP_DIR"
ECR_FRONTEND_URL="$ECR_FRONTEND_URL" ECR_BACKEND_URL="$ECR_BACKEND_URL" \
  docker compose -f docker-compose.prod.yml up -d

# ── 8. Seed database (first run) ─────────────────────────────────────────────
echo "[8/9] Seeding database..."
sleep 5  # wait for backend to be ready
docker compose -f docker-compose.prod.yml exec backend python seed.py || echo "  Seed already done or failed — check manually."

# ── 9. Configure cron for cert renewal ───────────────────────────────────────
echo "[9/9] Configuring cert renewal cron..."
(crontab -l 2>/dev/null; echo "0 */12 * * * cd $APP_DIR && ECR_FRONTEND_URL=$ECR_FRONTEND_URL ECR_BACKEND_URL=$ECR_BACKEND_URL docker compose -f docker-compose.prod.yml restart frontend certbot") | crontab -

echo ""
echo "══════════════════════════════════════════"
echo " Setup complete!"
echo ""
echo " Site:  https://$DOMAIN"
echo " Admin: https://$DOMAIN/admin"
echo ""
echo " Admin password is in: $APP_DIR/backend/.env"
echo " Check logs: docker compose -f $APP_DIR/docker-compose.prod.yml logs -f"
echo "══════════════════════════════════════════"
