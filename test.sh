#!/usr/bin/env bash
# Quick local test script that loads .env (if present) and runs sample requests.
# Usage: make .env with GEMINI_API_KEY and GEMINI_ENDPOINT, then run ./test.sh
set -euo pipefail

if [ -f .env ]; then
  echo "Loading .env"
  # Export all variables in .env into the environment for the script
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
else
  echo ".env not found; running against local server with whatever env is set"
fi

BASE=http://localhost:3000

echo "Checking health..."
curl -sS $BASE/healthz | jq || true

echo
echo "Sending /api/chat test"
curl -sS -X POST "$BASE/api/chat" -H "Content-Type: application/json" \
  -d '{"message":"Hello from test script"}' | jq || true

echo
echo "Sending /api/compare test"
curl -sS -X POST "$BASE/api/compare" -H "Content-Type: application/json" \
  -d '{"message":"Explain recursion in simple terms","personas":["helpful","concise","funny"]}' | jq || true
