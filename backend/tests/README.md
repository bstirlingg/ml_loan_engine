# Backend Test Suite

This directory contains comprehensive unit tests for the Loan Engine backend API.

## Test Coverage

### Priority 1 Tests (Critical - 100% Coverage)
- **test_business_rules.py**: Tests for business decision logic
- **test_preprocessing.py**: Tests for data preprocessing and ML pipeline
- **test_field_mapping.py**: Tests for frontend-to-backend field mapping

### Priority 2 Tests (Important - 90%+ Coverage)
- **test_api.py**: Tests for FastAPI endpoints
- **test_pydantic_models.py**: Tests for request/response validation models

## Setup

1. Install test dependencies:
```bash
cd backend
pip install -r requirements-test.txt
```

2. Run all tests:
```bash
pytest
```

3. Run specific test file:
```bash
pytest tests/test_business_rules.py
pytest tests/test_api.py -v
```

4. Run with coverage:
```bash
pytest --cov=. --cov-report=html
```

5. View coverage report:
```bash
open htmlcov/index.html
```

## Test Organization

- Each test file focuses on a specific module or functionality
- Tests use descriptive names that explain what they're testing
- Fixtures are used to provide reusable test data
- Mocking is used to isolate units under test

## Running Specific Test Categories

```bash
# Run only business logic tests
pytest tests/test_business_rules.py

# Run only API tests
pytest tests/test_api.py

# Run with verbose output
pytest -v

# Run and show print statements
pytest -s
```

## Expected Coverage

- **Business Logic (make_decision)**: 100%
- **Data Preprocessing**: 100%
- **Field Mapping**: 100%
- **API Endpoints**: 90%+
- **Pydantic Models**: 90%+

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    pip install -r requirements-test.txt
    pytest --cov=. --cov-report=xml
```
