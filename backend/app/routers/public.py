import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

RESUME_DIR = Path("data/resumes")
ALLOWED_LANGS = {"pt", "en"}

from app.database import get_db
from app.models import Experience, Project
from app.schemas import ExperienceResponse, ProjectResponse

router = APIRouter()


@router.get("/api/experiences", response_model=list[ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order).all()


@router.get("/api/projects", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.order).all()
    result = []
    for p in projects:
        data = ProjectResponse.model_validate(p)
        data.tech_stack = json.loads(p.tech_stack) if isinstance(p.tech_stack, str) else p.tech_stack
        result.append(data)
    return result


@router.get("/api/resume/{lang}")
def download_resume(lang: str):
    if lang not in ALLOWED_LANGS:
        raise HTTPException(status_code=400, detail="Invalid language. Use 'pt' or 'en'.")
    path = RESUME_DIR / f"resume_{lang}.pdf"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Resume not found.")
    return FileResponse(
        path=str(path),
        media_type="application/pdf",
        filename=f"resume_{lang}.pdf",
        headers={"Content-Disposition": f'attachment; filename="resume_{lang}.pdf"'},
    )
