#!/bin/bash
# Sync AI instructions to a project for various IDEs
# Usage: ./sync-to-project.sh /path/to/project [project-type] [ide...]
#
# Examples:
#   ./sync-to-project.sh /path/to/project react-agent           # All IDEs
#   ./sync-to-project.sh /path/to/project react-agent claude    # Claude only
#   ./sync-to-project.sh /path/to/project react-agent cursor gemini

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$(dirname "$SCRIPT_DIR")"
INSTRUCTIONS_DIR="$CONFIG_DIR/instructions"

# Parse arguments
PROJECT_PATH="${1:-.}"
PROJECT_TYPE="${2:-}"
shift 2 2>/dev/null || true
IDES=("$@")

# Default to all IDEs if none specified
if [ ${#IDES[@]} -eq 0 ]; then
  IDES=("claude" "cursor" "gemini" "codex")
fi

# Validate project path
if [ ! -d "$PROJECT_PATH" ]; then
  echo "Error: Project path does not exist: $PROJECT_PATH"
  exit 1
fi

PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"

echo "Syncing AI instructions to: $PROJECT_PATH"
echo "Project type: ${PROJECT_TYPE:-base}"
echo "IDEs: ${IDES[*]}"
echo ""

# Function to combine instruction files
combine_instructions() {
  local output_file="$1"

  # Start with base instructions
  cat "$INSTRUCTIONS_DIR/base.md" > "$output_file"
  echo "" >> "$output_file"

  # Add coding standards
  if [ -f "$INSTRUCTIONS_DIR/coding-standards.md" ]; then
    cat "$INSTRUCTIONS_DIR/coding-standards.md" >> "$output_file"
    echo "" >> "$output_file"
  fi

  # Add project-type specific instructions
  if [ -n "$PROJECT_TYPE" ] && [ -f "$INSTRUCTIONS_DIR/project-types/$PROJECT_TYPE.md" ]; then
    cat "$INSTRUCTIONS_DIR/project-types/$PROJECT_TYPE.md" >> "$output_file"
    echo "" >> "$output_file"
  fi
}

# Sync to Claude Code
sync_claude() {
  echo "Syncing to Claude Code..."

  mkdir -p "$PROJECT_PATH/.claude"

  # Create CLAUDE.md
  combine_instructions "$PROJECT_PATH/.claude/CLAUDE.md"

  # Add Claude-specific header
  local temp_file=$(mktemp)
  cat > "$temp_file" << 'EOF'
# Project Context

This file provides context for Claude Code sessions.

EOF
  cat "$PROJECT_PATH/.claude/CLAUDE.md" >> "$temp_file"
  mv "$temp_file" "$PROJECT_PATH/.claude/CLAUDE.md"

  echo "  Created: .claude/CLAUDE.md"
}

# Sync to Cursor
sync_cursor() {
  echo "Syncing to Cursor..."

  combine_instructions "$PROJECT_PATH/.cursorrules"

  # Add Cursor-specific header
  local temp_file=$(mktemp)
  cat > "$temp_file" << 'EOF'
# Cursor Rules

These rules guide Cursor's AI assistant.

EOF
  cat "$PROJECT_PATH/.cursorrules" >> "$temp_file"
  mv "$temp_file" "$PROJECT_PATH/.cursorrules"

  echo "  Created: .cursorrules"
}

# Sync to Gemini CLI
sync_gemini() {
  echo "Syncing to Gemini CLI..."

  combine_instructions "$PROJECT_PATH/GEMINI.md"

  # Add Gemini-specific header
  local temp_file=$(mktemp)
  cat > "$temp_file" << 'EOF'
# Gemini Context

This file provides context for Gemini CLI sessions.

EOF
  cat "$PROJECT_PATH/GEMINI.md" >> "$temp_file"
  mv "$temp_file" "$PROJECT_PATH/GEMINI.md"

  # Sync conductor files (Gemini's equivalent of skills)
  if [ -d "$CONFIG_DIR/skills" ]; then
    mkdir -p "$PROJECT_PATH/conductor"
    for skill_dir in "$CONFIG_DIR/skills"/*; do
      if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
        skill_name=$(basename "$skill_dir")
        cp "$skill_dir/SKILL.md" "$PROJECT_PATH/conductor/$skill_name.md"
      fi
    done
    echo "  Created: conductor/*.md"
  fi

  echo "  Created: GEMINI.md"
}

# Sync to Codex
sync_codex() {
  echo "Syncing to Codex..."

  combine_instructions "$PROJECT_PATH/AGENTS.md"

  # Add Codex-specific header
  local temp_file=$(mktemp)
  cat > "$temp_file" << 'EOF'
# Codex Agent Instructions

These instructions guide the Codex agent.

EOF
  cat "$PROJECT_PATH/AGENTS.md" >> "$temp_file"
  mv "$temp_file" "$PROJECT_PATH/AGENTS.md"

  echo "  Created: AGENTS.md"
}

# Run syncs for specified IDEs
for ide in "${IDES[@]}"; do
  case "$ide" in
    claude)
      sync_claude
      ;;
    cursor)
      sync_cursor
      ;;
    gemini)
      sync_gemini
      ;;
    codex)
      sync_codex
      ;;
    *)
      echo "Warning: Unknown IDE '$ide', skipping"
      ;;
  esac
done

echo ""
echo "Sync complete!"
echo ""
echo "Files created:"
[ -f "$PROJECT_PATH/.claude/CLAUDE.md" ] && echo "  - .claude/CLAUDE.md (Claude Code)"
[ -f "$PROJECT_PATH/.cursorrules" ] && echo "  - .cursorrules (Cursor)"
[ -f "$PROJECT_PATH/GEMINI.md" ] && echo "  - GEMINI.md (Gemini CLI)"
[ -f "$PROJECT_PATH/AGENTS.md" ] && echo "  - AGENTS.md (Codex)"
[ -d "$PROJECT_PATH/conductor" ] && echo "  - conductor/*.md (Gemini conductor)"
