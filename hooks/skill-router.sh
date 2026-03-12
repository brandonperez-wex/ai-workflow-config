#!/usr/bin/env bash
# UserPromptSubmit hook: RAG-based skill routing via embedding similarity + graph traversal
# Reads user message from stdin, outputs additionalContext JSON
set -euo pipefail

# Resolve the router directory relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$(dirname "$SCRIPT_DIR")"
ROUTER_DIR="$CONFIG_DIR/skill-router"

# Check if Ollama is running, start it if not
if ! curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
  if command -v ollama &> /dev/null; then
    ollama serve > /dev/null 2>&1 &
    sleep 2
  else
    # No Ollama available, skip routing silently
    exit 0
  fi
fi

# Run the router
exec node "$ROUTER_DIR/dist/route.js"
