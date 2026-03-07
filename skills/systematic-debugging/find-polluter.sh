#!/usr/bin/env bash
# Bisection script to find which test creates unwanted files/state
#
# Usage:
#   ./find-polluter.sh <file_or_dir_to_check> <test_pattern> [test_command]
#
# Examples:
#   ./find-polluter.sh '.git' 'src/**/*.test.ts'
#   ./find-polluter.sh '.git' 'src/**/*.test.ts' 'npx vitest run'
#   ./find-polluter.sh 'tmp/leaked.db' 'tests/*.py' 'pytest'
#   ./find-polluter.sh '.next' 'tests/**/*.test.tsx' 'bun test'
#
# Arguments:
#   file_or_dir_to_check  Path to check for after each test (e.g., '.git', 'tmp/')
#   test_pattern          Glob pattern for test files
#   test_command           Test runner command (default: 'npm test')

set -e

if [ $# -lt 2 ]; then
  echo "Usage: $0 <file_to_check> <test_pattern> [test_command]"
  echo ""
  echo "Examples:"
  echo "  $0 '.git' 'src/**/*.test.ts'"
  echo "  $0 '.git' 'src/**/*.test.ts' 'npx vitest run'"
  echo "  $0 'tmp/leaked.db' 'tests/*.py' 'pytest'"
  exit 1
fi

POLLUTION_CHECK="$1"
TEST_PATTERN="$2"
TEST_CMD="${3:-npm test}"

echo "Searching for test that creates: $POLLUTION_CHECK"
echo "Test pattern: $TEST_PATTERN"
echo "Test command: $TEST_CMD"
echo ""

# Get list of test files
TEST_FILES=$(find . -path "$TEST_PATTERN" | sort)
TOTAL=$(echo "$TEST_FILES" | wc -l | tr -d ' ')

echo "Found $TOTAL test files"
echo ""

COUNT=0
for TEST_FILE in $TEST_FILES; do
  COUNT=$((COUNT + 1))

  # Clean up pollution if it exists from previous test
  if [ -e "$POLLUTION_CHECK" ]; then
    rm -rf "$POLLUTION_CHECK"
  fi

  echo "[$COUNT/$TOTAL] Testing: $TEST_FILE"

  # Run the test
  $TEST_CMD "$TEST_FILE" > /dev/null 2>&1 || true

  # Check if pollution appeared
  if [ -e "$POLLUTION_CHECK" ]; then
    echo ""
    echo "FOUND POLLUTER!"
    echo "  Test: $TEST_FILE"
    echo "  Created: $POLLUTION_CHECK"
    echo ""
    echo "Pollution details:"
    ls -la "$POLLUTION_CHECK"
    echo ""
    echo "To investigate:"
    echo "  $TEST_CMD $TEST_FILE    # Run just this test"
    echo "  cat $TEST_FILE          # Review test code"
    exit 1
  fi
done

echo ""
echo "No polluter found — all $TOTAL tests clean."
exit 0
