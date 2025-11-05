"""
Priority 2: API Endpoint Tests (Simplified)
Tests for FastAPI endpoints - Critical tests only
Test IDs: P2-API-01 through P2-API-05
"""
import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import numpy as np

# Add parent directory to path to import main module
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app


class TestAPIEndpoints:
    """Test suite for API endpoints - 5 important tests"""

    @pytest.fixture
    def client(self):
        """Create test client"""
        return TestClient(app)

    @pytest.fixture
    def valid_request_data(self):
        """Valid loan application request data"""
        return {
            "age": 35,
            "gender": "Female",
            "education": "Bachelor",
            "income": 80000,
            "employmentExperience": 10,
            "homeOwnership": "OWN",
            "loanAmount": 15000,
            "loanIntent": "HOMEIMPROVEMENT",
            "interestRate": 8.5,
            "loanPercentageIncome": 0.19,
            "creditHistoryLength": 12,
            "creditScore": 750,
            "previousLoanDefault": "No"
        }

    def test_health_endpoint(self, client):
        """
        P2-API-01: Test GET /health endpoint returns healthy status
        Expected: Status 200, model_loaded = true
        """
        with patch('main.model', MagicMock()), \
             patch('main.model_columns', ['col1', 'col2']):

            response = client.get("/health")

            assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
            data = response.json()
            assert data["status"] == "healthy", f"Expected healthy status"
            assert data["model_loaded"] is True, f"Expected model_loaded to be True"

    def test_evaluate_valid_request(self, client, valid_request_data):
        """
        P2-API-02: Test POST /api/evaluate with valid loan application
        Expected: Status 200, returns decision, defaultProbability, confidenceScore
        """
        mock_model = MagicMock()
        mock_model.predict_proba.return_value = np.array([[0.3, 0.7]])
        mock_model.predict.return_value = np.array([1])

        mock_columns = [
            'person_age', 'person_income', 'person_emp_exp', 'loan_amnt',
            'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length',
            'credit_score', 'previous_loan_defaults_on_file',
            'person_gender_Male', 'person_education_Bachelor',
            'person_home_ownership_OWN', 'loan_intent_HOMEIMPROVEMENT'
        ]

        mock_scaler = MagicMock()
        mock_scaler.transform = lambda x: x

        with patch('main.model', mock_model), \
             patch('main.model_columns', mock_columns), \
             patch('main.scaler', mock_scaler):

            response = client.post("/api/evaluate", json=valid_request_data)

            assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
            data = response.json()
            assert "decision" in data, "Response should contain decision"
            assert "defaultProbability" in data, "Response should contain defaultProbability"
            assert "confidenceScore" in data, "Response should contain confidenceScore"
            assert data["decision"] in ["APPROVE", "REJECT", "REFER"], f"Invalid decision: {data['decision']}"

    def test_invalid_age_validation(self, client, valid_request_data):
        """
        P2-API-03: Test validation error when age < 18
        Expected: Status 422, validation error message
        """
        invalid_data = valid_request_data.copy()
        invalid_data["age"] = 15

        response = client.post("/api/evaluate", json=invalid_data)

        assert response.status_code == 422, f"Expected status 422 for invalid age, got {response.status_code}"

    def test_invalid_credit_score_validation(self, client, valid_request_data):
        """
        P2-API-04: Test validation error when credit score > 850
        Expected: Status 422, validation error message
        """
        invalid_data = valid_request_data.copy()
        invalid_data["creditScore"] = 900

        response = client.post("/api/evaluate", json=invalid_data)

        assert response.status_code == 422, f"Expected status 422 for invalid credit score, got {response.status_code}"

    def test_high_risk_applicant(self, client, valid_request_data):
        """
        P2-API-05: Test high-risk applicant returns REJECT decision
        Expected: Decision = "REJECT" for high-risk profile
        """
        # Simulate high default probability
        mock_model = MagicMock()
        mock_model.predict_proba.return_value = np.array([[0.15, 0.85]])  # 85% default prob
        mock_model.predict.return_value = np.array([1])

        mock_columns = [
            'person_age', 'person_income', 'person_emp_exp', 'loan_amnt',
            'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length',
            'credit_score', 'previous_loan_defaults_on_file',
            'person_gender_Male', 'person_education_Bachelor',
            'person_home_ownership_OWN', 'loan_intent_HOMEIMPROVEMENT'
        ]

        mock_scaler = MagicMock()
        mock_scaler.transform = lambda x: x

        with patch('main.model', mock_model), \
             patch('main.model_columns', mock_columns), \
             patch('main.scaler', mock_scaler):

            response = client.post("/api/evaluate", json=valid_request_data)

            assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
            data = response.json()
            assert data["decision"] == "REJECT", f"Expected REJECT for high-risk applicant, got {data['decision']}"
            assert data["defaultProbability"] > 0.70, f"Expected high probability > 0.70, got {data['defaultProbability']}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
