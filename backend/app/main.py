from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from app.database import engine, Base, get_db
from app.models import Message

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

@app.get("/")
def read_root():
    return {"message": "My Next Job API is running!"}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
