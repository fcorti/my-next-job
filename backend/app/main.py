from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from pathlib import Path
import uuid
import shutil
from app.database import engine, Base, get_db
from app.models import Message, JobRole, JobOpportunity, Watchlist

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="My Next Job API")

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageCreate(BaseModel):
    text: str

class MessageResponse(BaseModel):
    id: int
    text: str
    created_at: datetime

    class Config:
        from_attributes = True

class JobRoleCreate(BaseModel):
    name: str
    cv_filename: str

class JobRoleUpdate(BaseModel):
    name: str = None
    cv_filename: str = None
    is_active: bool = None

class JobRoleResponse(BaseModel):
    id: int
    name: str
    cv_filename: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class JobOpportunityCreate(BaseModel):
    url: str
    job_role_id: int
    score: int = 0

class JobOpportunityResponse(BaseModel):
    url: str
    job_role_id: int
    score: int
    created_at: datetime

    class Config:
        from_attributes = True

class WatchlistCreate(BaseModel):
    url: str
    job_role_id: int
    last_visit: Optional[datetime] = None

class WatchlistResponse(BaseModel):
    url: str
    job_role_id: int
    last_visit: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Initialize sample data
def init_sample_data(db: Session):
    """Initialize database with sample job roles if table is empty"""
    existing_roles = db.query(JobRole).count()
    if existing_roles == 0:
        sample_roles = [
            JobRole(name="Senior Full Stack Developer - React & FastAPI", cv_filename="cv_senior_fullstack.pdf", cv_storage_name="cv_senior_fullstack.pdf", is_active=True),
            JobRole(name="Backend Engineer - Python & PostgreSQL", cv_filename="cv_backend_python.pdf", cv_storage_name="cv_backend_python.pdf", is_active=False),
            JobRole(name="Frontend Developer - React & TypeScript", cv_filename="cv_frontend_react.pdf", cv_storage_name="cv_frontend_react.pdf", is_active=False),
            JobRole(name="DevOps Engineer - Docker & Kubernetes", cv_filename="cv_devops.pdf", cv_storage_name="cv_devops.pdf", is_active=False),
            JobRole(name="Data Engineer - ETL & Analytics", cv_filename="cv_data_engineer.pdf", cv_storage_name="cv_data_engineer.pdf", is_active=False),
        ]
        for role in sample_roles:
            db.add(role)
        db.commit()

        # Add sample opportunities for the active role
        active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
        if active_role:
            sample_opportunities = [
                JobOpportunity(url="https://example.com/job/fullstack-dev-1", job_role_id=active_role.id, score=95),
                JobOpportunity(url="https://example.com/job/fullstack-dev-2", job_role_id=active_role.id, score=88),
                JobOpportunity(url="https://example.com/job/fullstack-senior-3", job_role_id=active_role.id, score=92),
            ]
            for opp in sample_opportunities:
                db.add(opp)
            db.commit()
            
            # Add sample watchlist for the active role
            sample_watchlist = [
                Watchlist(url="https://careers.google.com", job_role_id=active_role.id),
                Watchlist(url="https://careers.microsoft.com", job_role_id=active_role.id),
                Watchlist(url="https://www.linkedin.com/jobs", job_role_id=active_role.id),
            ]
            for watch in sample_watchlist:
                db.add(watch)
            db.commit()

def ensure_job_role_storage_column(db: Session):
    db.execute(text("ALTER TABLE job_roles ADD COLUMN IF NOT EXISTS cv_storage_name VARCHAR(255)"))
    db.commit()

# Initialize on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    ensure_job_role_storage_column(db)
    init_sample_data(db)
    db.close()

@app.get("/")
def read_root():
    return {"message": "My Next Job API is running!"}

# Message endpoints
@app.get("/messages", response_model=list[MessageResponse])
def get_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).all()
    return messages

@app.post("/messages", response_model=MessageResponse)
def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    db_message = Message(text=message.text)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/messages/{message_id}", response_model=MessageResponse)
def get_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@app.delete("/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}

# Job Role endpoints
@app.get("/job-roles", response_model=list[JobRoleResponse])
def get_job_roles(db: Session = Depends(get_db)):
    """Get all job roles"""
    roles = db.query(JobRole).all()
    return roles

@app.post("/job-roles", response_model=JobRoleResponse)
def create_job_role(
    name: str = Form(...),
    cv_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Create a new job role"""
    sanitized_name = name.strip()
    if not sanitized_name:
        raise HTTPException(status_code=400, detail="Job role name cannot be empty")

    # Check if name already exists
    existing = db.query(JobRole).filter(JobRole.name == sanitized_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job role name already exists")

    if cv_file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="CV file must be a PDF")

    original_filename = Path(cv_file.filename).name
    file_extension = Path(original_filename).suffix.lower()
    if file_extension != ".pdf":
        raise HTTPException(status_code=400, detail="CV file must be a PDF")

    unique_name = f"{uuid.uuid4().hex}{file_extension}"
    file_path = UPLOAD_DIR / unique_name
    with file_path.open("wb") as target_file:
        shutil.copyfileobj(cv_file.file, target_file)

    db_role = JobRole(
        name=sanitized_name,
        cv_filename=original_filename,
        cv_storage_name=unique_name,
        is_active=False,
    )
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@app.get("/job-roles/{role_id}/cv")
def download_job_role_cv(role_id: int, db: Session = Depends(get_db)):
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")

    storage_name = role.cv_storage_name or role.cv_filename
    file_path = UPLOAD_DIR / storage_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=role.cv_filename,
    )

@app.get("/job-roles/{role_id}", response_model=JobRoleResponse)
def get_job_role(role_id: int, db: Session = Depends(get_db)):
    """Get a specific job role"""
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")
    return role

@app.put("/job-roles/{role_id}", response_model=JobRoleResponse)
def update_job_role(role_id: int, role_update: JobRoleUpdate, db: Session = Depends(get_db)):
    """Update a job role"""
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")
    
    # If setting is_active to True, deactivate all others
    if role_update.is_active is True:
        db.query(JobRole).update({JobRole.is_active: False})
    
    if role_update.name is not None:
        role.name = role_update.name
    if role_update.cv_filename is not None:
        role.cv_filename = role_update.cv_filename
    if role_update.is_active is not None:
        role.is_active = role_update.is_active
    
    db.commit()
    db.refresh(role)
    return role

@app.delete("/job-roles/{role_id}")
def delete_job_role(role_id: int, db: Session = Depends(get_db)):
    """Delete a job role"""
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Job role not found")
    db.delete(role)
    db.commit()
    return {"message": "Job role deleted successfully"}

# Job Opportunity endpoints
@app.get("/opportunities", response_model=list[JobOpportunityResponse])
def get_opportunities(db: Session = Depends(get_db)):
    """Get all opportunities for the active job role"""
    active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
    if not active_role:
        return []
    opportunities = db.query(JobOpportunity).filter(JobOpportunity.job_role_id == active_role.id).all()
    return opportunities

@app.post("/opportunities", response_model=JobOpportunityResponse)
def create_opportunity(opp: JobOpportunityCreate, db: Session = Depends(get_db)):
    """Create a new job opportunity"""
    # Check if opportunity already exists
    existing = db.query(JobOpportunity).filter(
        JobOpportunity.url == opp.url,
        JobOpportunity.job_role_id == opp.job_role_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Opportunity already exists for this job role")
    
    db_opp = JobOpportunity(url=opp.url, job_role_id=opp.job_role_id, score=opp.score)
    db.add(db_opp)
    db.commit()
    db.refresh(db_opp)
    return db_opp

@app.get("/opportunities/active-role")
def get_active_role(db: Session = Depends(get_db)):
    """Get the currently active job role"""
    active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
    if not active_role:
        return {"active_role": None}
    return {"active_role": active_role.name, "id": active_role.id}

# Watchlist endpoints
@app.get("/watchlist", response_model=list[WatchlistResponse])
def get_watchlist(db: Session = Depends(get_db)):
    """Get all watchlist entries for the active job role"""
    active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
    if not active_role:
        return []
    watchlist = db.query(Watchlist).filter(Watchlist.job_role_id == active_role.id).all()
    return watchlist

@app.post("/watchlist", response_model=WatchlistResponse)
def create_watchlist_entry(watch: WatchlistCreate, db: Session = Depends(get_db)):
    """Create a new watchlist entry"""
    # Check if entry already exists
    existing = db.query(Watchlist).filter(
        Watchlist.url == watch.url,
        Watchlist.job_role_id == watch.job_role_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Watchlist entry already exists for this job role")
    
    db_watch = Watchlist(url=watch.url, job_role_id=watch.job_role_id, last_visit=watch.last_visit)
    db.add(db_watch)
    db.commit()
    db.refresh(db_watch)
    return db_watch

@app.delete("/watchlist")
def delete_watchlist_entry(url: str, db: Session = Depends(get_db)):
    """Delete a watchlist entry for the active job role"""
    active_role = db.query(JobRole).filter(JobRole.is_active == True).first()
    if not active_role:
        raise HTTPException(status_code=404, detail="No active job role found")
    
    entry = db.query(Watchlist).filter(
        Watchlist.url == url,
        Watchlist.job_role_id == active_role.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")
    
    db.delete(entry)
    db.commit()
    return {"message": "Watchlist entry deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

