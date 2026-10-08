import joblib
import pandas as pd
import streamlit as st


def comma_tokenizer(text):
  if isinstance(text, str):
    return [t.strip() for t in text.split(',')]
  return text




st.set_page_config(
    page_title='Salary Prediction Dashboard',
    page_icon='💼',
    layout='wide',
)


@st.cache_resource
def load_model():
  # Ensure 'model.pkl' is in the same directory as this app.py file
  return joblib.load('model.pkl')


try:
  model = load_model()
except Exception as e:
  st.error(
      f"Error loading 'model.pkl'. Make sure the file is in the same directory."
      f' Details: {e}'
  )
  st.stop()


st.title('Candidate Salary Prediction Dashboard')
st.markdown(
    'Enter candidate qualifications, background details, and job preferences'
    ' below to estimate projected salary using the trained XGBoost pipeline.'
)


with st.form('prediction_form'):
  st.subheader('Candidate & Job Parameters')

  col1, col2, col3 = st.columns(3)

  with col1:
    st.markdown('### Experience & Background')
    years_experience = st.number_input(
        'Years of Experience', min_value=0.0, max_value=40.0, value=3.0, step=0.5
    )
    student_experience_level = st.selectbox(
        'Student Experience Level',
        ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    )
    education = st.selectbox(
        'Education Level',
        ["Bachelor's", "Master's", 'PhD', 'Diploma', 'High School'],
    )
    student_cgpa = st.number_input(
        'Student CGPA / Grade', min_value=0.0, max_value=10.0, value=8.0, step=0.1
    )
    student_career_label = st.selectbox(
        'Student Career Label',
        [
            'Software Engineer',
            'Data Scientist',
            'Data Analyst',
            'Product Manager',
            'DevOps Engineer',
        ],
    )

  with col2:
    st.markdown('### Skills & Portfolio')
    candidate_skills = st.text_input(
        'Candidate Skills (comma-separated)',
        'Python, Machine Learning, SQL, Pandas',
    )
    required_skills = st.text_input(
        'Required Skills (comma-separated)', 'Python, SQL'
    )
    skill_coverage = st.slider(
        'Skill Coverage Ratio', min_value=0.0, max_value=1.0, value=0.8, step=0.05
    )
    student_internships = st.number_input(
        'Internships Completed', min_value=0, max_value=10, value=1, step=1
    )
    student_github_repos = st.number_input(
        'GitHub Repositories', min_value=0, max_value=100, value=5, step=1
    )
    student_hackathons_participated = st.number_input(
        'Hackathons Participated', min_value=0, max_value=50, value=2, step=1
    )
    student_coding_platform_rating = st.number_input(
        'Coding Platform Rating (e.g., LeetCode/Codeforces)',
        min_value=0,
        max_value=3500,
        value=1400,
        step=50,
    )
    student_weekly_study_hours = st.number_input(
        'Weekly Study/Work Hours', min_value=0, max_value=100, value=40, step=5
    )

  with col3:
    st.markdown('### Job & Fit Details')
    job_title = st.text_input('Job Title', 'Data Scientist')
    industry = st.text_input('Industry', 'Technology & AI')
    company_size = st.selectbox(
        'Company Size', ['Startup', 'Medium', 'Enterprise']
    )
    job_location = st.text_input('Job Location', 'Remote')
    work_mode = st.selectbox('Work Mode', ['Remote', 'Hybrid', 'On-site'])
    candidate_preferred_work_mode = st.selectbox(
        'Preferred Work Mode', ['Remote', 'Hybrid', 'On-site']
    )
    fit_label = st.number_input(
        'Fit Label (Candidate Match Quality)',min_value=0,max_value=1
    )


  submitted = st.form_submit_button(
      ' Predict Salary', use_container_width=True
  )


if submitted:
  # Construct DataFrame matching the exact feature names expected by your model pipeline
  input_data = pd.DataFrame(
      [{
          'years_experience': years_experience,
          'education': education,
          'candidate_skills': candidate_skills,
          'job_title': job_title,
          'industry': industry,
          'company_size': company_size,
          'job_location': job_location,
          'work_mode': work_mode,
          'candidate_preferred_work_mode': candidate_preferred_work_mode,
          'required_skills': required_skills,
          'skill_coverage': skill_coverage,
          'fit_label': fit_label,
          'student_career_label': student_career_label,
          'student_cgpa': student_cgpa,
          'student_internships': student_internships,
          'student_github_repos': student_github_repos,
          'student_hackathons_participated': student_hackathons_participated,
          'student_coding_platform_rating': student_coding_platform_rating,
          'student_weekly_study_hours': student_weekly_study_hours,
          'student_experience_level': student_experience_level,
      }]
  )

  try:
    # Run prediction through the pipeline
    prediction = model.predict(input_data)
    estimated_salary = prediction[0]

    # Display Results Card
    st.success('Prediction Successful!')

    metric_col1, metric_col2, metric_col3 = st.columns(3)
    with metric_col2:
      st.metric(
          label='Estimated Annual Salary',
          value=f'Rs.{estimated_salary-3:,.2f}LPA',
          delta=f'Experience: {years_experience} yrs',
      )

  except Exception as e:
    st.error(
        f'An error occurred while generating the prediction. Please check if'
        f' categorical values match training labels.\n\nError: {e}'
    )