from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.classification_api import router as classification_router
from app.final_match_api import router as final_match_router
from app.recommend_api import router as recommend_router
from app.regression_api import router as regression_router

app = FastAPI(title="AI Job Matching API")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False,
                   allow_methods=["*"], allow_headers=["*"])

app.include_router(classification_router)   
app.include_router(regression_router)       
app.include_router(final_match_router)      
app.include_router(recommend_router)       


@app.get("/")
def home():
    return {"message": "AI Job Matching API is running"}
