from sqlalchemy import Column, Integer, String, Boolean, Text

from app.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    description_en = Column(Text, nullable=False)
    description_pt = Column(Text, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=True)
    location = Column(String, default="")
    order = Column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description_en = Column(Text, nullable=False)
    description_pt = Column(Text, nullable=False)
    tech_stack = Column(Text, nullable=False, default="[]")  # JSON array as string
    live_url = Column(String, nullable=True)
    repo_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    type = Column(String, nullable=False, default="professional")
    featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
