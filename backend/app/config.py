from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/portfolio.db"
    jwt_secret: str = "change-me-to-random-string"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    admin_user: str = "admin"
    admin_password: str = "change-me"

    smtp_host: str = "mail.luiseduardo.dev.br"
    smtp_port: int = 587
    smtp_user: str = "contato@luiseduardo.dev.br"
    smtp_password: str = ""
    contact_email: str = "contato@luiseduardo.dev.br"

    allowed_origins: str = "http://localhost:5173,http://localhost,https://luiseduardo.dev.br"
    trusted_hosts: str = "localhost,luiseduardo.dev.br,*.luiseduardo.dev.br"

    # Production: hide Swagger/OpenAPI docs
    hide_docs: bool = False

    # Rate limiting
    contact_rate_limit: str = "3/minute"
    login_rate_limit: str = "5/minute"
    global_rate_limit: str = "60/minute"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
