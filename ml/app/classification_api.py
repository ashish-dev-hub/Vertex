from fastapi import APIRouter
from app import loader
from app.schemas import ClassificationInput

router = APIRouter(tags=["Classification"])

@router.post("/classification")
def classification(data: ClassificationInput):
    fit_score = loader.get_classifier_score(data.model_dump())
    return {
        "fit_score": fit_score,
        "fit_percentage": round(fit_score * 100, 2),
        "suitable": fit_score >= loader.THRESHOLD,
    }