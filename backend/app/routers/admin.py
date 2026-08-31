import json
import os
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

RESUME_DIR = Path("data/resumes")
ALLOWED_LANGS = {"pt", "en"}
MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10 MB

from app.auth import create_token, verify_admin
from app.config import settings
from app.database import get_db
from app.models import Experience, Project
from app.schemas import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
    LoginRequest,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
    TokenResponse,
)

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# ─── Brute-force protection ──────────────────────────────────
_failed_attempts: dict[str, list[float]] = defaultdict(list)
LOCKOUT_THRESHOLD = 5
LOCKOUT_WINDOW = 300  # 5 minutes


def _check_lockout(ip: str) -> None:
    """Block IP after too many failed login attempts."""
    now = time.time()
    # Clean old attempts
    _failed_attempts[ip] = [t for t in _failed_attempts[ip] if now - t < LOCKOUT_WINDOW]
    if len(_failed_attempts[ip]) >= LOCKOUT_THRESHOLD:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")


def _record_failure(ip: str) -> None:
    _failed_attempts[ip].append(time.time())


def _clear_failures(ip: str) -> None:
    _failed_attempts.pop(ip, None)


@router.post("/api/admin/login", response_model=TokenResponse)
@limiter.limit(settings.login_rate_limit)
def login(request: Request, data: LoginRequest):
    ip = get_remote_address(request)
    _check_lockout(ip)

    if data.username != settings.admin_user or data.password != settings.admin_password:
        _record_failure(ip)
        # Constant-time-ish response to avoid timing attacks on username existence
        raise HTTPException(status_code=401, detail="Invalid credentials")

    _clear_failures(ip)
    token = create_token(data.username)
    return TokenResponse(access_token=token)


# ─── Experiences ───────────────────────────────────────────

@router.get("/api/admin/experiences", response_model=list[ExperienceResponse])
def list_experiences(db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    return db.query(Experience).order_by(Experience.order).all()


@router.post("/api/admin/experiences", response_model=ExperienceResponse)
def create_experience(data: ExperienceCreate, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    exp = Experience(**data.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/api/admin/experiences/{exp_id}", response_model=ExperienceResponse)
def update_experience(exp_id: int, data: ExperienceUpdate, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(exp, key, value)
    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/api/admin/experiences/{exp_id}")
def delete_experience(exp_id: int, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"ok": True}


# ─── Projects ─────────────────────────────────────────────

@router.get("/api/admin/projects", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    projects = db.query(Project).order_by(Project.order).all()
    result = []
    for p in projects:
        data = ProjectResponse.model_validate(p)
        data.tech_stack = json.loads(p.tech_stack) if isinstance(p.tech_stack, str) else p.tech_stack
        result.append(data)
    return result


@router.post("/api/admin/projects", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    proj = Project(**data.model_dump())
    proj.tech_stack = json.dumps(data.tech_stack)
    db.add(proj)
    db.commit()
    db.refresh(proj)
    resp = ProjectResponse.model_validate(proj)
    resp.tech_stack = data.tech_stack
    return resp


@router.put("/api/admin/projects/{proj_id}", response_model=ProjectResponse)
def update_project(proj_id: int, data: ProjectUpdate, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    proj = db.query(Project).filter(Project.id == proj_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    update_data = data.model_dump(exclude_unset=True)
    if "tech_stack" in update_data:
        update_data["tech_stack"] = json.dumps(update_data["tech_stack"])
    for key, value in update_data.items():
        setattr(proj, key, value)
    db.commit()
    db.refresh(proj)
    resp = ProjectResponse.model_validate(proj)
    resp.tech_stack = json.loads(proj.tech_stack) if isinstance(proj.tech_stack, str) else proj.tech_stack
    return resp


@router.delete("/api/admin/projects/{proj_id}")
def delete_project(proj_id: int, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    proj = db.query(Project).filter(Project.id == proj_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(proj)
    db.commit()
    return {"ok": True}


# ─── Resume ────────────────────────────────────────────────

@router.get("/api/admin/resume/status")
def get_resume_status(_: str = Depends(verify_admin)):
    result = {}
    for lang in ALLOWED_LANGS:
        path = RESUME_DIR / f"resume_{lang}.pdf"
        if path.is_file():
            stat = path.stat()
            result[lang] = {
                "exists": True,
                "size": stat.st_size,
                "last_modified": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
            }
        else:
            result[lang] = {"exists": False}
    return result


@router.post("/api/admin/resume/{lang}")
async def upload_resume(lang: str, file: UploadFile = File(...), _: str = Depends(verify_admin)):
    if lang not in ALLOWED_LANGS:
        raise HTTPException(status_code=400, detail="Invalid language. Use 'pt' or 'en'.")
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Only PDF files are accepted.")
    content = await file.read()
    if len(content) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10 MB.")
    RESUME_DIR.mkdir(parents=True, exist_ok=True)
    dest = RESUME_DIR / f"resume_{lang}.pdf"
    dest.write_bytes(content)
    return {"ok": True, "lang": lang, "size": len(content)}
