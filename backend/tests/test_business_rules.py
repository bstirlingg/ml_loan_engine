import pytest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from main import make_decision


class TestMakeDecision:
    """Simplified test suite for business decision logic - 4 critical tests"""

    def test_reject_high_probability(self):
        """
        P1-BL-01: Test REJECT decision when default probability > 70%
        Expected: Decision = "REJECT" when probability = 0.85
        """
        decision = make_decision(default_probability=0.85, confidence=0.50)
        assert decision == "REJECT", f"Expected REJECT but got {decision}"

    def test_approve_low_probability_high_confidence(self):
        """
        P1-BL-02: Test APPROVE decision when probability < 30% AND confidence > 70%
        Expected: Decision = "APPROVE" when probability = 0.20, confidence = 0.80
        """
        decision = make_decision(default_probability=0.20, confidence=0.80)
        assert decision == "APPROVE", f"Expected APPROVE but got {decision}"

    def test_refer_medium_probability(self):
        """
        P1-BL-03: Test REFER decision for medium risk applicants
        Expected: Decision = "REFER" when probability = 0.50
        """
        decision = make_decision(default_probability=0.50, confidence=0.80)
        assert decision == "REFER", f"Expected REFER but got {decision}"

    def test_boundary_condition_30_percent(self):
        """
        P1-BL-04: Test boundary condition at exactly 30% probability
        Expected: Decision = "REFER" when probability = 0.30 (not < 0.30)
        """
        decision = make_decision(default_probability=0.30, confidence=0.80)
        assert decision == "REFER", f"Expected REFER but got {decision}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])