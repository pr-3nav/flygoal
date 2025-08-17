from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class JerseyDesign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = ""
    designer: str
    imageUrl: str
    votes: int = Field(default=0)
    voterIds: List[str] = Field(default_factory=list)
    submittedAt: datetime = Field(default_factory=datetime.utcnow)
    isActive: bool = Field(default=True)

class JerseyDesignCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    designer: str
    imageUrl: str

class VoteRequest(BaseModel):
    voterSessionId: str

class Stats(BaseModel):
    totalDesigns: int
    totalVotes: int
    activeDesigners: int
    productionRuns: int = Field(default=12)

class UploadResponse(BaseModel):
    filename: str
    url: str