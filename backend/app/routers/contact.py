import bleach
from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings
from app.schemas import ContactRequest, ContactResponse
from app.services.email import send_contact_email

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


def sanitize(text: str) -> str:
    """Strip all HTML tags to prevent XSS in email content."""
    return bleach.clean(text, tags=[], strip=True)


@router.post("/api/contact", response_model=ContactResponse)
@limiter.limit(settings.contact_rate_limit)
async def contact(request: Request, data: ContactRequest):
    try:
        await send_contact_email(
            name=sanitize(data.name),
            email=data.email,
            subject=sanitize(data.subject),
            message=sanitize(data.message),
        )
        return ContactResponse(success=True, message="Message sent successfully")
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to send email. Please try again later.")
