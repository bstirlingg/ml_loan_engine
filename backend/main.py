from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Literal, Optional
import pandas as pd
import joblib
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Loan Decision API",
    description="AI-powered loan application evaluation system",
    version="1.0.0"
)

# Configure CORS - allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model artifacts at startup
MODEL_DIR = Path(__file__).parent / "model" / "trained"

try:
    model = joblib.load(MODEL_DIR / "loan_model_rf.pkl")
    model_columns = joblib.load(MODEL_DIR / "model_columns_rf.pkl")
    scaler = joblib.load(MODEL_DIR / "scaler_rf.pkl")
    logger.info("✅ ML model loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load ML model: {e}")
    model = None
    model_columns = None
    scaler = None


# Pydantic models for request/response validation
class LoanApplicationRequest(BaseModel):
    """Loan application request with frontend field names (camelCase)"""
    age: int = Field(..., ge=18, le=100, description="Applicant age")
    gender: Literal["Male", "Female", "Other"] = Field(..., description="Applicant gender")
    education: Literal["High School", "Bachelor", "Master", "PhD", "Associate", "Doctorate"] = Field(..., description="Education level")
    income: float = Field(..., gt=0, description="Annual income")
    employmentExperience: int = Field(..., ge=0, description="Years of employment experience")
    homeOwnership: Literal["RENT", "OWN", "MORTGAGE", "OTHER"] = Field(..., description="Home ownership status")
    loanAmount: float = Field(..., gt=0, description="Requested loan amount")
    loanIntent: Literal["PERSONAL", "EDUCATION", "MEDICAL", "VENTURE", "HOMEIMPROVEMENT", "DEBTCONSOLIDATION"] = Field(..., description="Loan purpose")
    interestRate: float = Field(..., ge=0, le=100, description="Interest rate percentage")
    loanPercentageIncome: float = Field(..., ge=0, description="Loan as percentage of income")
    creditHistoryLength: int = Field(..., ge=0, description="Length of credit history in years")
    creditScore: int = Field(..., ge=300, le=850, description="Credit score")
    previousLoanDefault: Literal["Yes", "No"] = Field(..., description="Previous loan default history")
    timestamp: Optional[str] = Field(None, description="Request timestamp")

    @validator('loanAmount')
    def validate_loan_amount(cls, v, values):
        if 'income' in values and v > values['income'] * 10:
            logger.warning(f"Loan amount ({v}) is unusually high compared to income ({values['income']})")
        return v


class LoanDecisionResponse(BaseModel):
    """Loan decision response"""
    decision: Literal["APPROVE", "REJECT", "REFER"]
    defaultProbability: float = Field(..., ge=0, le=1, description="Probability of default (0-1)")
    confidenceScore: float = Field(..., ge=0, le=1, description="Model confidence score (0-1)")


def map_frontend_to_backend(request: LoanApplicationRequest) -> dict:
    """
    Map frontend camelCase fields to backend snake_case fields
    """
    return {
        'person_age': request.age,
        'person_gender': request.gender,
        'person_education': request.education,
        'person_income': request.income,
        'person_emp_exp': request.employmentExperience,
        'person_home_ownership': request.homeOwnership,
        'loan_amnt': request.loanAmount,
        'loan_intent': request.loanIntent,
        'loan_int_rate': request.interestRate,
        'loan_percent_income': request.loanPercentageIncome,
        'cb_person_cred_hist_length': request.creditHistoryLength,
        'credit_score': request.creditScore,
        'previous_loan_defaults_on_file': request.previousLoanDefault
    }


def preprocess_applicant(applicant_data: dict) -> pd.DataFrame:
    """
    Preprocess applicant data to match model's expected format
    """
    # Convert previous_loan_defaults_on_file to numeric
    applicant_data['previous_loan_defaults_on_file'] = 1 if applicant_data['previous_loan_defaults_on_file'] == 'Yes' else 0

    # Convert to DataFrame
    applicant_df = pd.DataFrame([applicant_data])

    # One-hot encode categorical variables
    categorical_cols = ['person_gender', 'person_education', 'person_home_ownership', 'loan_intent']
    applicant_df = pd.get_dummies(applicant_df, columns=categorical_cols, drop_first=True)

    # Add missing columns from training (set to 0)
    for col in model_columns:
        if col not in applicant_df.columns:
            applicant_df[col] = 0

    # Reorder columns to match training
    applicant_df = applicant_df[model_columns]

    # Scale numeric features
    numeric_cols = [
        'person_age',
        'person_income',
        'person_emp_exp',
        'loan_amnt',
        'loan_int_rate',
        'loan_percent_income',
        'cb_person_cred_hist_length',
        'credit_score',
        'previous_loan_defaults_on_file'
    ]
    applicant_df[numeric_cols] = scaler.transform(applicant_df[numeric_cols])

    return applicant_df


def make_decision(default_probability: float, confidence: float) -> str:
    """
    Business logic for loan decision

    Rules:
    - APPROVE: Low default probability (< 0.30) and high confidence
    - REJECT: High default probability (> 0.70)
    - REFER: Medium risk or low confidence - needs manual review
    """
    if default_probability > 0.70:
        return "REJECT"
    elif default_probability < 0.30 and confidence > 0.70:
        return "APPROVE"
    else:
        return "REFER"


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Loan Decision API",
        "version": "1.0.0",
        "model_loaded": model is not None
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    if model is None:
        raise HTTPException(status_code=503, detail="ML model not loaded")

    return {
        "status": "healthy",
        "model_loaded": True,
        "model_columns": len(model_columns) if model_columns is not None else 0
    }


@app.post("/api/evaluate", response_model=LoanDecisionResponse)
async def evaluate_loan(request: LoanApplicationRequest):
    """
    Evaluate a loan application using the trained ML model

    Returns a decision (APPROVE/REJECT/REFER), default probability, and confidence score
    """
    try:
        # Check if model is loaded
        if model is None:
            logger.error("Model not loaded")
            raise HTTPException(status_code=503, detail="ML model not available")

        logger.info(f"Evaluating loan application for applicant age {request.age}")

        # Map frontend fields to backend fields
        backend_data = map_frontend_to_backend(request)

        # Preprocess data
        applicant_df = preprocess_applicant(backend_data)

        # Get predictions
        default_probability = float(model.predict_proba(applicant_df)[0][1])
        prediction = int(model.predict(applicant_df)[0])

        # Calculate confidence (using probability distance from 0.5)
        confidence = abs(default_probability - 0.5) * 2

        # Make business decision
        decision = make_decision(default_probability, confidence)

        logger.info(f"Decision: {decision}, Default Prob: {default_probability:.2%}, Confidence: {confidence:.2%}")

        return LoanDecisionResponse(
            decision=decision,
            defaultProbability=default_probability,
            confidenceScore=confidence
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during evaluation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during loan evaluation: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
