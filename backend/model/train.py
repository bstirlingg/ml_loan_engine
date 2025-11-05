import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

# -------------------------------
# Load dataset
# -------------------------------
df = pd.read_csv("./data/loan_data.csv")
df.columns = [col.strip() for col in df.columns]

# -------------------------------
# Convert previous_loan_defaults_on_file to numeric
# -------------------------------
df['previous_loan_defaults_on_file'] = df['previous_loan_defaults_on_file'].map({'No':0, 'Yes':1})

# -------------------------------
# Fill missing numeric values
# -------------------------------
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
df[numeric_cols] = df[numeric_cols].fillna(0)

# -------------------------------
# One-hot encode categorical variables
# -------------------------------
categorical_cols = ['person_gender', 'person_education', 'person_home_ownership', 'loan_intent']
df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

# -------------------------------
# Split features and target
# -------------------------------
X = df.drop('loan_status', axis=1)
y = df['loan_status']

# -------------------------------
# Scale numeric features (optional for Random Forest)
# -------------------------------
scaler = StandardScaler()
X[numeric_cols] = scaler.fit_transform(X[numeric_cols])

# -------------------------------
# Train-test split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -------------------------------
# Train Random Forest Classifier
# -------------------------------
model = RandomForestClassifier(
    n_estimators=300,
    class_weight='balanced',   
    random_state=42,
    max_depth=10               
)
model.fit(X_train, y_train)

# -------------------------------
# Save model, columns, and scaler
# -------------------------------
joblib.dump(model, "./trained/loan_model_rf.pkl")
joblib.dump(X.columns, "./trained/model_columns_rf.pkl")
joblib.dump(scaler, "./trained/scaler_rf.pkl")

print("Random Forest model, columns, and scaler saved in './trained/'")


