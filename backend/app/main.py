from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import admin, contact, public

# Create tables
Base.metadata.create_all(bind=engine)

# Rate limiter (per IP)
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Portfolio API",
    docs_url=None if settings.hide_docs else "/docs",
    redoc_url=None if settings.hide_docs else "/redoc",
    openapi_url=None if settings.hide_docs else "/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ─── Security Headers Middleware ─────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cache-Control"] = "no-store"
        # Remove server identification
        response.headers.pop("server", None)
        return response


app.add_middleware(SecurityHeadersMiddleware)

# Trusted hosts — reject requests with spoofed Host headers
allowed_hosts = [h.strip() for h in settings.trusted_hosts.split(",")]
app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# CORS — tightened: only allow specific methods and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
)

app.include_router(contact.router)
app.include_router(public.router)
app.include_router(admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Global exception handler — never leak internal errors to client
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
