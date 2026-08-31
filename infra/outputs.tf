output "elastic_ip" {
  description = "Public Elastic IP of the EC2 instance — point your DNS here"
  value       = aws_eip.portfolio.public_ip
}

output "ecr_frontend_url" {
  description = "ECR URL for the frontend image"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_url" {
  description = "ECR URL for the backend image"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_registry" {
  description = "ECR registry base URL (add to GitHub secret ECR_REGISTRY)"
  value       = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

output "github_actions_access_key_id" {
  description = "AWS Access Key ID for GitHub Actions (add to GitHub secret AWS_ACCESS_KEY_ID)"
  value       = aws_iam_access_key.github_actions.id
}

output "github_actions_secret_access_key" {
  description = "AWS Secret Access Key for GitHub Actions (add to GitHub secret AWS_SECRET_ACCESS_KEY)"
  value       = aws_iam_access_key.github_actions.secret
  sensitive   = true
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ec2-user@${aws_eip.portfolio.public_ip}"
}

data "aws_caller_identity" "current" {}
