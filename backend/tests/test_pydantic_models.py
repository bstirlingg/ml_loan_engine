"""
Priority 2: Pydantic Model Tests (Simplified)
Tests for request/response validation models - Critical tests only
Test IDs: P2-VAL-01 through P2-VAL-03
"""
import pytest
import sys
from pathlib import Path
from pydantic import ValidationError

# Add parent directory to path to import main module
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import LoanApplicationRequest, LoanDecisionResponse


class TestPydanticModels:
    """Simplified test suite for Pydantic validation models - 3 critical tests"""

    @pytest.fixture
    def valid_request_data(self):
        """Valid loan application data"""
        return {
            "age": 35,
            "gender": "Male",
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

    def test_valid_request_passes_validation(self, valid_request_data):
        """
        P2-VAL-01: Test valid LoanApplicationRequest passes validation
        Expected: No validation errors with complete, valid data
        """
        request = LoanApplicationRequest(**valid_request_data)

        assert request.age == 35, "Age should be preserved"
        assert request.gender == "Male", "Gender should be preserved"
        assert request.education == "Bachelor", "Education should be preserved"
        assert request.income == 80000, "Income should be preserved"
        assert request.creditScore == 750, "Credit score should be preserved"

    def test_invalid_gender_fails_validation(self, valid_request_data):
        """
        P2-VAL-02: Test invalid gender value fails validation
        Expected: ValidationError raised for gender="InvalidGender"
        """
        valid_request_data["gender"] = "InvalidGender"

        with pytest.raises(ValidationError) as exc_info:
            LoanApplicationRequest(**valid_request_data)

        assert "gender" in str(exc_info.value).lower(), "Error should mention gender field"

    def test_credit_score_boundaries(self, valid_request_data):
        """
        P2-VAL-03: Test credit score boundaries (300-850)
        Expected: 300 and 850 pass, 299 and 851 fail
        """
        # Test minimum boundary (300) - should pass
        valid_request_data["creditScore"] = 300
        request = LoanApplicationRequest(**valid_request_data)
        assert request.creditScore == 300, "Credit score 300 should be valid"

        # Test maximum boundary (850) - should pass
        valid_request_data["creditScore"] = 850
        request = LoanApplicationRequest(**valid_request_data)
        assert request.creditScore == 850, "Credit score 850 should be valid"

        # Test below minimum (299) - should fail
        valid_request_data["creditScore"] = 299
        with pytest.raises(ValidationError) as exc_info:
            LoanApplicationRequest(**valid_request_data)
        assert "creditScore" in str(exc_info.value), "Error should mention creditScore for value 299"

        # Test above maximum (851) - should fail
        valid_request_data["creditScore"] = 851
        with pytest.raises(ValidationError) as exc_info:
            LoanApplicationRequest(**valid_request_data)
        assert "creditScore" in str(exc_info.value), "Error should mention creditScore for value 851"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
