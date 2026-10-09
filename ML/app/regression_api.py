from fastapi import APIRouter

from app import loader
from app.schemas import RegressionInput

router = APIRouter(tags=["Regression"])


@router.post("/regression")
def regression(data: RegressionInput):
    salary = loader.get_salary(data.model_dump())
    return {
        "predicted_salary_lpa": round(salary, 2),
        "salary_score": round(loader.salary_fit(salary), 4),
    }
