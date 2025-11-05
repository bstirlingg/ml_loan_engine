#!/bin/bash

# Test Verification Script for Loan Engine
# This script verifies that all tests can run successfully

echo "=========================================="
echo "Loan Engine - Test Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
backend_status=0
frontend_status=0

# Backend Tests
echo "📋 Checking Backend Tests..."
echo "-------------------------------------------"

cd backend

if [ ! -d "tests" ]; then
    echo -e "${RED}❌ Backend tests directory not found${NC}"
    backend_status=1
else
    echo -e "${GREEN}✓${NC} Backend tests directory exists"
fi

if [ ! -f "requirements-test.txt" ]; then
    echo -e "${RED}❌ requirements-test.txt not found${NC}"
    backend_status=1
else
    echo -e "${GREEN}✓${NC} requirements-test.txt exists"
fi

if [ ! -f "pytest.ini" ]; then
    echo -e "${RED}❌ pytest.ini not found${NC}"
    backend_status=1
else
    echo -e "${GREEN}✓${NC} pytest.ini exists"
fi

# Count test files
test_count=$(find tests -name "test_*.py" | wc -l | tr -d ' ')
echo -e "${GREEN}✓${NC} Found $test_count test files"

# Check if pytest is installed
if command -v pytest &> /dev/null; then
    echo -e "${GREEN}✓${NC} pytest is installed"

    echo ""
    echo -e "${YELLOW}Running backend tests...${NC}"
    pytest --tb=short -v

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ All backend tests passed!${NC}"
    else
        echo -e "${RED}❌ Some backend tests failed${NC}"
        backend_status=1
    fi
else
    echo -e "${YELLOW}⚠${NC}  pytest not installed. Run: pip install -r requirements-test.txt"
    backend_status=1
fi

cd ..
echo ""

# Frontend Tests
echo "📋 Checking Frontend Tests..."
echo "-------------------------------------------"

cd front-end

if [ ! -d "__tests__" ]; then
    echo -e "${RED}❌ Frontend tests directory not found${NC}"
    frontend_status=1
else
    echo -e "${GREEN}✓${NC} Frontend tests directory exists"
fi

if [ ! -f "vitest.config.js" ]; then
    echo -e "${RED}❌ vitest.config.js not found${NC}"
    frontend_status=1
else
    echo -e "${GREEN}✓${NC} vitest.config.js exists"
fi

if [ ! -f "vitest.setup.js" ]; then
    echo -e "${RED}❌ vitest.setup.js not found${NC}"
    frontend_status=1
else
    echo -e "${GREEN}✓${NC} vitest.setup.js exists"
fi

# Count test files
test_count=$(find __tests__ -name "*.test.jsx" -o -name "*.test.js" | wc -l | tr -d ' ')
echo -e "${GREEN}✓${NC} Found $test_count test files"

# Check if vitest is installed
if [ -f "node_modules/.bin/vitest" ]; then
    echo -e "${GREEN}✓${NC} vitest is installed"

    echo ""
    echo -e "${YELLOW}Running frontend tests...${NC}"
    npm test -- --run

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ All frontend tests passed!${NC}"
    else
        echo -e "${RED}❌ Some frontend tests failed${NC}"
        frontend_status=1
    fi
else
    echo -e "${YELLOW}⚠${NC}  vitest not installed. Run: npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom @vitejs/plugin-react"
    frontend_status=1
fi

cd ..
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="

if [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo -e "${GREEN}✅ All tests configured and passing!${NC}"
    exit 0
elif [ $backend_status -eq 0 ]; then
    echo -e "${YELLOW}⚠  Backend tests passing, frontend needs setup${NC}"
    exit 1
elif [ $frontend_status -eq 0 ]; then
    echo -e "${YELLOW}⚠  Frontend tests passing, backend needs setup${NC}"
    exit 1
else
    echo -e "${RED}❌ Tests need setup. See TESTING_GUIDE.md${NC}"
    exit 1
fi
