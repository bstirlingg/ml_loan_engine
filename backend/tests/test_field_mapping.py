"""
Priority 1: Field Mapping Tests (Simplified)
Tests for map_frontend_to_backend() function - Critical tests only
Test IDs: P1-FM-01 through P1-FM-03
"""
import pytest
import sys
from pathlib import Path

# Add parent directory to path to import main module
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import map_frontend_to_backend, LoanApplicationRequest


class TestFieldMapping:
    """Simplified test suite for frontend to backend field mapping - 3 critical tests"""

    def test_all_fields_are_mapped(self):
        """
        P1-FM-01: Test all 13 fields are mapped from frontend to backend
        Expected: All fields mapped correctly (age→person_age, etc.)
        """
        request = LoanApplicationRequest(
            age=35,
            gender="Male",
            education="Bachelor",
            income=80000,
            employmentExperience=10,
            homeOwnership="OWN",
            loanAmount=15000,
            loanIntent="HOMEIMPROVEMENT",
            interestRate=8.5,
            loanPercentageIncome=0.19,
            creditHistoryLength=12,
            creditScore=750,
            previousLoanDefault="No"
        )

        result = map_frontend_to_backend(request)

        # Verify all expected backend fields exist
        expected_fields = [
            'person_age', 'person_gender', 'person_education', 'person_income',
            'person_emp_exp', 'person_home_ownership', 'loan_amnt', 'loan_intent',
            'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length',
            'credit_score', 'previous_loan_defaults_on_file'
        ]

        assert len(result) == 13, f"Expected 13 fields, got {len(result)}"
        for field in expected_fields:
            assert field in result, f"Missing backend field: {field}"

    def test_values_are_preserved(self):
        """
        P1-FM-02: Test field values are preserved during mapping
        Expected: Values remain unchanged after mapping
        """
        request = LoanApplicationRequest(
            age=25,
            gender="Female",
            education="Master",
            income=100000,
            employmentExperience=8,
            homeOwnership="MORTGAGE",
            loanAmount=20000,
            loanIntent="EDUCATION",
            interestRate=7.5,
            loanPercentageIncome=0.20,
            creditHistoryLength=10,
            creditScore=800,
            previousLoanDefault="Yes"
        )

        result = map_frontend_to_backend(request)

        # Verify values match
        assert result['person_age'] == 25
        assert result['person_gender'] == "Female"
        assert result['person_income'] == 100000
        assert result['loan_amnt'] == 20000
        assert result['credit_score'] == 800
        assert result['previous_loan_defaults_on_file'] == "Yes"

    def test_categorical_values_mapped(self):
        """
        P1-FM-03: Test categorical values are correctly mapped
        Expected: Gender "Male" maps to person_gender "Male", etc.
        """
        request = LoanApplicationRequest(
            age=30,
            gender="Male",
            education="Bachelor",
            income=50000,
            employmentExperience=5,
            homeOwnership="RENT",
            loanAmount=10000,
            loanIntent="PERSONAL",
            interestRate=10.0,
            loanPercentageIncome=0.20,
            creditHistoryLength=5,
            creditScore=700,
            previousLoanDefault="No"
        )

        result = map_frontend_to_backend(request)

        # Test categorical mappings
        assert result['person_gender'] == "Male"
        assert result['person_education'] == "Bachelor"
        assert result['person_home_ownership'] == "RENT"
        assert result['loan_intent'] == "PERSONAL"
        assert result['previous_loan_defaults_on_file'] == "No"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
