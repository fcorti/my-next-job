from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    cv_filename = Column(String(255), nullable=False)
    cv_storage_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    opportunities = relationship("JobOpportunity", back_populates="job_role", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="job_role", cascade="all, delete-orphan")
    search_sessions = relationship("SearchSession", back_populates="job_role", cascade="all, delete-orphan")

class JobOpportunity(Base):
    __tablename__ = "job_opportunities"

    url = Column(String(2048), primary_key=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="CASCADE"), primary_key=True, nullable=False)
    score = Column(Integer, nullable=False, default=0)
    status = Column(String(50), nullable=False, default="New")
    last_update = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job_role = relationship("JobRole", back_populates="opportunities")

class Watchlist(Base):
    __tablename__ = "watchlist"

    url = Column(String(2048), primary_key=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="CASCADE"), primary_key=True, nullable=False)
    last_visit = Column(DateTime(timezone=True), nullable=True)
    page_type = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job_role = relationship("JobRole", back_populates="watchlist")

class SearchSession(Base):
    __tablename__ = "search_sessions"

    id = Column(Integer, primary_key=True, index=True)
    job_role_id = Column(Integer, ForeignKey("job_roles.id", ondelete="CASCADE"), nullable=False)
    start_datetime = Column(DateTime(timezone=True), nullable=False)
    end_datetime = Column(DateTime(timezone=True), nullable=True)
    score_threshold = Column(Integer, nullable=False)
    log_file_path = Column(String(1024), nullable=True)

    job_role = relationship("JobRole", back_populates="search_sessions")

