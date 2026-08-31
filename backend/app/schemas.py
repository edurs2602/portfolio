from pydantic import BaseModel, EmailStr, Field


# Auth
class LoginRequest(BaseModel):
    username: str = Field(max_length=50)
    password: str = Field(max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Contact — strict limits to prevent abuse
class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class ContactResponse(BaseModel):
    success: bool
    message: str


# Experience
class ExperienceBase(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    role: str = Field(min_length=1, max_length=200)
    description_en: str = Field(min_length=1, max_length=5000)
    description_pt: str = Field(min_length=1, max_length=5000)
    start_date: str = Field(min_length=1, max_length=50)
    end_date: str | None = Field(default=None, max_length=50)
    location: str = Field(default="", max_length=200)
    order: int = Field(default=0, ge=0, le=1000)


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: str | None = Field(default=None, max_length=200)
    role: str | None = Field(default=None, max_length=200)
    description_en: str | None = Field(default=None, max_length=5000)
    description_pt: str | None = Field(default=None, max_length=5000)
    start_date: str | None = Field(default=None, max_length=50)
    end_date: str | None = Field(default=None, max_length=50)
    location: str | None = Field(default=None, max_length=200)
    order: int | None = Field(default=None, ge=0, le=1000)


class ExperienceResponse(ExperienceBase):
    id: int

    model_config = {"from_attributes": True}


# Project
class ProjectBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description_en: str = Field(min_length=1, max_length=5000)
    description_pt: str = Field(min_length=1, max_length=5000)
    tech_stack: list[str] = Field(max_length=30)
    live_url: str | None = Field(default=None, max_length=500)
    repo_url: str | None = Field(default=None, max_length=500)
    image_url: str | None = Field(default=None, max_length=500)
    type: str = Field(default="professional", max_length=50)
    featured: bool = False
    order: int = Field(default=0, ge=0, le=1000)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    description_en: str | None = Field(default=None, max_length=5000)
    description_pt: str | None = Field(default=None, max_length=5000)
    tech_stack: list[str] | None = Field(default=None, max_length=30)
    live_url: str | None = Field(default=None, max_length=500)
    repo_url: str | None = Field(default=None, max_length=500)
    image_url: str | None = Field(default=None, max_length=500)
    type: str | None = Field(default=None, max_length=50)
    featured: bool | None = None
    order: int | None = Field(default=None, ge=0, le=1000)


class ProjectResponse(ProjectBase):
    id: int

    model_config = {"from_attributes": True}
