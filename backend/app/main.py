from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from app.database import engine, Base, get_db
from app.models import Message, JobRole

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="My Next Job API")

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

# Initialize sample data
def init_sample_data(db: Session):
    """Initialize database with sample job roles if table is empty"""
    existing_roles = db.query(JobRole).count()
    if existing_roles == 0:
        sample_roles = [
            JobRole(name="Senior Full Stack Developer - React & FastAPI", cv_filename="cv_senior_fullstack.pdf", is_active=True),
            JobRole(name="Backend Engineer - Python & PostgreSQL", cv_filename="cv_backend_python.pdf", is_active=False),
            JobRole(name="Frontend Developer - React & TypeScript", cv_filename="cv_frontend_react.pdf", is_active=False),
            JobRole(name="DevOps Engineer - Docker & Kubernetes", cv_filename="cv_devops.pdf", is_active=False),
            JobRole(name="Data Engineer - ETL & Analytics", cv_filename="cv_data_engineer.pdf", is_active=False),
        ]
        for role in sample_roles:
            db.add(role)
        db.commit()

# Initialize on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
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
def create_job_role(role: JobRoleCreate, db: Session = Depends(get_db)):
    """Create a new job role"""
    # Check if name already exists
    existing = db.query(JobRole).filter(JobRole.name == role.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job role name already exists")
    
    db_role = JobRole(name=role.name, cv_filename=role.cv_filename, is_active=False)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

