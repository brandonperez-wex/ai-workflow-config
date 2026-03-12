#!/usr/bin/env bash
# Slim session-start hook: tells Claude skills exist, RAG router handles per-message routing
set -euo pipefail

cat <<'CONTEXT'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "You have specialized skills available. Use the Skill tool to invoke them. A RAG-based skill router will suggest the right skill for each message via SKILL ROUTING context. When you see a SKILL ROUTING suggestion, follow it — invoke the recommended skill before proceeding. Key principles: process skills (design, systematic-debugging, research) run BEFORE implementation. Always verify before claiming done."
  }
}
CONTEXT

exit 0
