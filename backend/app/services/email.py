import html

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings


async def send_contact_email(name: str, email: str, subject: str, message: str) -> None:
    # HTML-escape all user input to prevent injection in email clients
    safe_name = html.escape(name)
    safe_email = html.escape(email)
    safe_subject = html.escape(subject)
    safe_message = html.escape(message)

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f5a623;">New Contact Message</h2>
        <p><strong>From:</strong> {safe_name} ({safe_email})</p>
        <p><strong>Subject:</strong> {safe_subject}</p>
        <hr style="border: 1px solid #eee;">
        <div style="white-space: pre-wrap; line-height: 1.6;">{safe_message}</div>
        <hr style="border: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">Sent from your portfolio contact form</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["From"] = settings.smtp_user
    msg["To"] = settings.contact_email
    msg["Subject"] = f"Portfolio Contact: {safe_subject}"
    msg["Reply-To"] = email
    msg.attach(MIMEText(message, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    await aiosmtplib.send(
        msg,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_user,
        password=settings.smtp_password,
        start_tls=True,
    )
