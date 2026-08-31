"""Seed initial data into the database."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, Base, engine
from app.models import Experience, Project

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing
db.query(Experience).delete()
db.query(Project).delete()

# Experiences
experiences = [
    Experience(
        company="Accenture",
        role="Full-Stack Developer",
        description_en="Build web applications with FastAPI and Vue.js. Manage DevOps pipelines using Azure DevOps, Azure Repos, and CI/CD pipelines. Deliver end-to-end solutions with a focus on scalability and maintainability.",
        description_pt="Construo aplicações web com FastAPI e Vue.js. Gerencio pipelines de DevOps usando Azure DevOps, Azure Repos e pipelines de CI/CD. Entrego soluções completas com foco em escalabilidade e manutenibilidade.",
        start_date="2025",
        end_date=None,
        location="Brazil",
        order=1,
    ),
    Experience(
        company="Fiscallize",
        role="Full-Stack Developer",
        description_en="Built a marketplace platform connecting schools with qualified service providers. Developed backend services and REST APIs with Django and PostgreSQL. Delivered responsive interfaces with Tailwind CSS, Docker-based environments, Pytest coverage, and CI/CD with GitHub Actions.",
        description_pt="Construí uma plataforma marketplace conectando escolas com prestadores de serviços qualificados. Desenvolvi serviços backend e APIs REST com Django e PostgreSQL. Entreguei interfaces responsivas com Tailwind CSS, ambientes Docker, cobertura com Pytest e CI/CD com GitHub Actions.",
        start_date="Aug 2024",
        end_date="Present",
        location="Recife, PE, Brazil",
        order=2,
    ),
    Experience(
        company="STI/UFRN",
        role="Back-End Developer",
        description_en="Developed integrations between PABX systems and the internal network team using NetBox. Built web services, microservices, and internal tools that improved process visibility and decision-making across campus infrastructure.",
        description_pt="Desenvolvi integrações entre sistemas PABX e a equipe de rede interna usando NetBox. Construí web services, microsserviços e ferramentas internas que melhoraram a visibilidade de processos e tomada de decisão na infraestrutura do campus.",
        start_date="Jul 2022",
        end_date="Aug 2024",
        location="Natal, RN, Brazil",
        order=3,
    ),
]

# Projects
projects = [
    Project(
        title="TinGo",
        description_en="Ticketing platform composed of a mobile app, web platform, and backend services. Coordinated the team and designed backend services for event ticketing flows including purchase, QR code generation, and transfer. Built CI/CD pipelines with GitHub Actions and cloud deployment on Azure.",
        description_pt="Plataforma de ticketing composta por app mobile, plataforma web e serviços backend. Coordenei a equipe e projetei serviços backend para fluxos de ticketing de eventos incluindo compra, geração de QR code e transferência. Construí pipelines CI/CD com GitHub Actions e deploy na Azure.",
        tech_stack=json.dumps(["Django", "Azure", "GitHub Actions", "Docker", "PostgreSQL"]),
        live_url=None,
        repo_url=None,
        type="professional",
        featured=True,
        order=1,
    ),
    Project(
        title="Chasqui Express",
        description_en="Package tracking application built as a freelance project. Developed the backend using Django, Docker, and PostgreSQL. Created critical and scalable functionalities, managed Docker environments, and optimized the database for performance and security.",
        description_pt="Aplicação de rastreamento de pacotes construída como projeto freelance. Desenvolvi o backend usando Django, Docker e PostgreSQL. Criei funcionalidades críticas e escaláveis, gerenciei ambientes Docker e otimizei o banco de dados para desempenho e segurança.",
        tech_stack=json.dumps(["Django", "Docker", "PostgreSQL"]),
        live_url="https://chasqui-tracker.vercel.app/",
        repo_url=None,
        type="freelance",
        featured=True,
        order=2,
    ),
    Project(
        title="Fiscallize",
        description_en="Marketplace platform that connects schools with qualified service providers. Implemented end-to-end contracting journeys with matching, demand management, and integrated hiring processes.",
        description_pt="Plataforma marketplace que conecta escolas com prestadores de serviços qualificados. Implementei jornadas de contratação ponta a ponta com matching, gerenciamento de demanda e processos de contratação integrados.",
        tech_stack=json.dumps(["Django", "PostgreSQL", "Tailwind CSS", "Docker", "GitHub Actions"]),
        live_url=None,
        repo_url=None,
        type="professional",
        featured=True,
        order=3,
    ),
]

db.add_all(experiences)
db.add_all(projects)
db.commit()
db.close()

print("Seed data inserted successfully!")
