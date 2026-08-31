import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
