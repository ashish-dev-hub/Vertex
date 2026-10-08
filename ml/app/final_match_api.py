from fastapi import APIRouter, HTTPException
from app import loader
from app.schemas import FinalMatchInput

router = APIRouter(tags=["Final Match"])

@router.post("/final-match")
def final_match(data: FinalMatchInput):
    try:
        return loader.get_final_score(data)
    except ValueError as e:
        raise HTTPException(422, str(e))