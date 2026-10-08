from typing import List, Union
from fastapi import APIRouter
from pydantic import BaseModel
from app import loader

router = APIRouter(tags=["Recommendation"])

class RecommendInput(BaseModel):
    skills: Union[str, List[str]]
    top_n: int = 5

@router.post("/recommend")
def recommend(data: RecommendInput):
    skills = loader.skill_text(data.skills)
    result = loader.recommand(skills, data.top_n)
    return result.to_dict(orient="records")