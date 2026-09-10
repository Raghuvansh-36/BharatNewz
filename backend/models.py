import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Text, DateTime, Float
from pydantic import BaseModel, Field, ConfigDict
from database import Base

# ==========================================
# SQLAlchemy ORM Models
# ==========================================

class NewsArticleModel(Base):
    __tablename__ = "news_articles"

    id = Column(String(64), primary_key=True, default=lambda: f"art_{uuid.uuid4().hex[:12]}")
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, default="General") # Politics, Environment, Health, Disasters, Tech, World
    country_code = Column(String(5), nullable=False, index=True) # e.g. USA, IND, GBR, JPN, BRA
    country_name = Column(String(100), nullable=False)
    threat_level = Column(String(20), nullable=False, default="none") # none, low, medium, high, critical
    threat_type = Column(String(50), nullable=False, default="none") # hurricane, flood, wildfire, earthquake, epidemic, none
    source = Column(String(100), nullable=True, default="Global News Network")
    image_url = Column(Text, nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)

class ThreatHighlightModel(Base):
    __tablename__ = "threat_highlights"

    id = Column(String(64), primary_key=True, default=lambda: f"th_{uuid.uuid4().hex[:12]}")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    threat_type = Column(String(50), nullable=False) # hurricane, flood, wildfire, earthquake, epidemic, storm
    severity = Column(String(20), nullable=False) # low, medium, high, critical
    country_code = Column(String(5), nullable=False, index=True)
    country_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=200.0)
    updated_at = Column(DateTime, default=datetime.utcnow)


# ==========================================
# Pydantic Schemas (Validation & Serialization)
# ==========================================

class NewsArticleCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, description="Headline of news article")
    summary: str = Field(..., min_length=10, description="Short summary for preview")
    content: Optional[str] = Field(None, description="Full article content")
    category: str = Field("General", description="Category: Politics, Environment, Health, Disasters, Tech, World")
    country_code: str = Field(..., max_length=5, description="ISO-3 Country Code, e.g. IND, USA")
    country_name: str = Field(..., max_length=100, description="Full Country Name")
    threat_level: str = Field("none", description="Threat severity: none, low, medium, high, critical")
    threat_type: str = Field("none", description="Type of threat: hurricane, flood, wildfire, earthquake, epidemic, none")
    source: Optional[str] = Field("Global News Wire", description="Publisher or news agency")
    image_url: Optional[str] = Field(None, description="Image thumbnail URL")

class NewsArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    summary: str
    content: Optional[str] = None
    category: str
    country_code: str
    country_name: str
    threat_level: str
    threat_type: str
    source: Optional[str] = None
    image_url: Optional[str] = None
    published_at: datetime

class ThreatHighlightCreate(BaseModel):
    title: str
    description: str
    threat_type: str
    severity: str
    country_code: str
    country_name: str
    latitude: float
    longitude: float
    radius_km: float = 200.0

class ThreatHighlightResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str
    threat_type: str
    severity: str
    country_code: str
    country_name: str
    latitude: float
    longitude: float
    radius_km: float
    updated_at: datetime

class CountrySummaryResponse(BaseModel):
    country_code: str
    country_name: str
    total_articles: int
    critical_threats: int
    categories: List[str]
    threat_types: List[str]
