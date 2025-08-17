from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
import os
from pathlib import Path
import uuid
import shutil
from models import JerseyDesign, JerseyDesignCreate, VoteRequest, Stats, UploadResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# MongoDB connection (using the existing client from server.py)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

router = APIRouter(prefix="/api", tags=["jerseys"])

# Ensure uploads directory exists
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.get("/jerseys", response_model=List[JerseyDesign])
async def get_jerseys(sort_by: Optional[str] = "votes"):
    """Get all jersey designs sorted by votes (desc) or date"""
    try:
        sort_field = "votes" if sort_by == "votes" else "submittedAt"
        sort_order = -1  # Descending order
        
        jerseys = await db.jerseys.find({"isActive": True}).sort(sort_field, sort_order).to_list(1000)
        
        return [JerseyDesign(**jersey) for jersey in jerseys]
    except Exception as e:
        logger.error(f"Error fetching jerseys: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jerseys")

@router.post("/jerseys", response_model=JerseyDesign)
async def create_jersey(jersey_data: JerseyDesignCreate):
    """Create a new jersey design"""
    try:
        jersey_dict = jersey_data.dict()
        jersey_obj = JerseyDesign(**jersey_dict)
        
        result = await db.jerseys.insert_one(jersey_obj.dict())
        
        if result.inserted_id:
            return jersey_obj
        else:
            raise HTTPException(status_code=500, detail="Failed to create jersey")
            
    except Exception as e:
        logger.error(f"Error creating jersey: {e}")
        raise HTTPException(status_code=500, detail="Failed to create jersey")

@router.put("/jerseys/{jersey_id}/vote")
async def toggle_vote(jersey_id: str, vote_data: VoteRequest):
    """Toggle vote for a jersey design"""
    try:
        # Find the jersey
        jersey = await db.jerseys.find_one({"id": jersey_id, "isActive": True})
        if not jersey:
            raise HTTPException(status_code=404, detail="Jersey not found")
        
        voter_session_id = vote_data.voterSessionId
        current_voters = jersey.get("voterIds", [])
        
        if voter_session_id in current_voters:
            # Unvote: remove voter and decrease count
            new_voters = [v for v in current_voters if v != voter_session_id]
            new_vote_count = max(0, jersey.get("votes", 0) - 1)
            action = "unvoted"
        else:
            # Vote: add voter and increase count
            new_voters = current_voters + [voter_session_id]
            new_vote_count = jersey.get("votes", 0) + 1
            action = "voted"
        
        # Update the jersey
        await db.jerseys.update_one(
            {"id": jersey_id},
            {
                "$set": {
                    "voterIds": new_voters,
                    "votes": new_vote_count
                }
            }
        )
        
        return {"success": True, "action": action, "newVoteCount": new_vote_count}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling vote: {e}")
        raise HTTPException(status_code=500, detail="Failed to process vote")

@router.get("/jerseys/{jersey_id}", response_model=JerseyDesign)
async def get_jersey(jersey_id: str):
    """Get a specific jersey design"""
    try:
        jersey = await db.jerseys.find_one({"id": jersey_id, "isActive": True})
        if not jersey:
            raise HTTPException(status_code=404, detail="Jersey not found")
        
        return JerseyDesign(**jersey)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching jersey: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jersey")

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload jersey design image"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate file size (10MB max)
        if file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return file info
        file_url = f"/api/uploads/{unique_filename}"
        
        return UploadResponse(filename=unique_filename, url=file_url)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file")

@router.get("/stats", response_model=Stats)
async def get_stats():
    """Get community statistics"""
    try:
        # Count total designs
        total_designs = await db.jerseys.count_documents({"isActive": True})
        
        # Sum total votes
        pipeline = [
            {"$match": {"isActive": True}},
            {"$group": {"_id": None, "totalVotes": {"$sum": "$votes"}}}
        ]
        vote_result = await db.jerseys.aggregate(pipeline).to_list(1)
        total_votes = vote_result[0]["totalVotes"] if vote_result else 0
        
        # Count unique designers
        designers = await db.jerseys.distinct("designer", {"isActive": True})
        active_designers = len(designers)
        
        return Stats(
            totalDesigns=total_designs,
            totalVotes=total_votes,
            activeDesigners=active_designers,
            productionRuns=12  # Static for now
        )
        
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")