import pandas as pd
import joblib

# -------------------------------
# Load model, columns, and scaler
# -------------------------------
model = joblib.load("./trained/loan_model_rf.pkl")
model_columns = joblib.load("./trained/model_columns_rf.pkl")
scaler = joblib.load("./trained/scaler_rf.pkl")

# -------------------------------
# Example applicant data
# -------------------------------


applicant = {
    'person_age': 24,
    'person_gender': 'Male',
    'person_education': 'High School',
    'person_income': 10000,         
    'person_emp_exp': 0,  
    'person_home_ownership': 'RENT',
    'loan_amnt': 30000, 
    'loan_intent': 'PERSONAL',
    'loan_int_rate': 20.0,      
    'loan_percent_income': 3.0,              
    'cb_person_cred_hist_length': 1,         
    'credit_score': 500,                 
    'previous_loan_defaults_on_file': 'No'
}





# Convert previous_loan_defaults_on_file to numeric
applicant['previous_loan_defaults_on_file'] = 1 if applicant['previous_loan_defaults_on_file'] == 'Yes' else 0

# Convert to DataFrame
applicant_df = pd.DataFrame([applicant])

# One-hot encode categorical variables
categorical_cols = ['person_gender', 'person_education', 'person_home_ownership', 'loan_intent']
applicant_df = pd.get_dummies(applicant_df, columns=categorical_cols, drop_first=True)

# Add missing columns from training
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

# -------------------------------
# Predict probability and approval
# -------------------------------
probability = model.predict_proba(applicant_df)[0][1]
prediction = model.predict(applicant_df)[0]

print(f"Loan approval probability: {probability:.2%}")
if probability > 0.85:
    print("✅ Loan likely to be approved!")
else:
    print("❌ Loan likely to be denied.")
