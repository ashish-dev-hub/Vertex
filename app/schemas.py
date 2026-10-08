from typing import List, Optional, Union
from pydantic import BaseModel, Field, model_validator

Skills = Union[str, List[str]]
Flexible = Union[int, float, str, List[str]]

class ClassificationInput(BaseModel):
    education: str
    years_experience: int= Field(ge=0)
    candidate_location: str
    candidate_preferred_work_mode: str
    student_year_of_study: float=Field(ge=0)
    student_cgpa: float = Field(gt=0)
    student_num_projects: float= Field(ge=0)
    student_certifications: Flexible
    student_internships: float= Field(ge=0)
    student_github_repos: float= Field(ge=0)
    student_hackathons_participated: float = Field(ge=0)
    student_coding_platform_rating: float = Field(ge=0)
    student_weekly_study_hours: float = Field(ge=0)
    student_career_label: str
    student_experience_level: str
    student_interests: Flexible
    job_title: str
    required_experience: int= Field(ge=0)
    job_location: str
    work_mode: str
    company_size: str
    industry: str
    job_duration_months: int = Field(gt=0)
    skill_coverage: float = Field(ge=0)
    experience_gap: Optional[float]= None 
    project_internship_score: Optional[float]= None 
    technical_activity_score: Optional[float]= None 
    @model_validator(mode="after")
    def calculate_features(self):
        self.experience_gap = (self.years_experience - self.required_experience)
        self.project_internship_score = (self.student_num_projects + self.student_internships)
        self.technical_activity_score = (self.student_github_repos +self.student_hackathons_participated)
        return self


class RegressionInput(BaseModel):
    education: str
    years_experience: int = Field(ge=0)
    candidate_location: str
    candidate_preferred_work_mode: str
    job_title: str
    required_experience: int= Field(ge=0)
    job_location: str
    work_mode: str
    company_size: str
    industry: str
    job_duration_months: int= Field(gt=0)
    skill_overlap: int = Field(ge=0)
    skill_coverage: float = Field(ge=0)
    student_year_of_study: float=Field(ge=0)
    student_cgpa: float = Field(gt=0)
    student_num_projects: float = Field(ge=0)
    student_internships: float = Field(ge=0)
    student_github_repos: float = Field(ge=0)
    student_career_label: str
    student_experience_level: str
    experience_gap: Optional[float]= None 
    project_internship_score: Optional[float]= None 
    technical_activity_score: Optional[float]= None 
    student_hackathons_participated: float = Field(ge=0)
    
    @model_validator(mode="after")
    def calculate_features(self):
        self.experience_gap = (self.years_experience - self.required_experience)
        self.project_internship_score = (self.student_num_projects + self.student_internships)
        self.technical_activity_score = (self.student_github_repos +self.student_hackathons_participated)
        return self


class FinalMatchInput(BaseModel):
    candidate_id: Optional[str] = None
    candidate_skills: Skills = Field(
        ...,
        examples=["python, sql, machine learning"]
    )

    education: str = "Unknown"
    years_experience: int = Field(ge=0)
    candidate_location: str = "Unknown"
    candidate_preferred_work_mode: str = "Unknown"
    student_year_of_study: float=Field(ge=0)
    student_cgpa: float = Field(gt=0)
    student_num_projects: float= Field(ge=0)

    student_certifications: Flexible
    student_internships: int = Field(default=0, ge=0)
    student_github_repos: float = Field(ge=0)
    student_hackathons_participated: float= Field(ge=0)
    student_coding_platform_rating: float = Field(default=0, ge=0)
    student_weekly_study_hours: float = Field(default=0, ge=0)

    student_career_label: str = "Unknown"
    student_experience_level: str = "Unknown"
    student_interests: Flexible = "Unknown"

    project_internship_score: Optional[float] = Field(default=None, ge=0)
    technical_activity_score: Optional[float] = Field(default=None, ge=0)

    job_title: str = Field(
        ...,
        examples=["Data Science Intern"]
    )
    required_skills: Optional[Skills] = None
    required_experience: float = Field(default=0, ge=0)
    job_location: str = "Unknown"
    work_mode: str = "Unknown"
    company_size: str = "Unknown"
    industry: str = "Unknown"
    job_duration_months: float = Field(default=6, gt=0)
    experience_gap: Optional[float]= None 
 
    @model_validator(mode="after")
    def calculate_features(self):
        self.experience_gap = (self.years_experience - self.required_experience)
        self.project_internship_score = (self.student_num_projects + self.student_internships)
        self.technical_activity_score = (self.student_github_repos +self.student_hackathons_participated)
        return self