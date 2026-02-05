#!/bin/bash
# Setup Claude Code with skills and agents from this config repo

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$(dirname "$SCRIPT_DIR")"
CLAUDE_DIR="$HOME/.claude"

echo "Setting up Claude Code configuration..."

# Create Claude directories if they don't exist
mkdir -p "$CLAUDE_DIR/skills"
mkdir -p "$CLAUDE_DIR/agents"

# Symlink skills
echo "Linking skills..."
for skill_dir in "$CONFIG_DIR/skills"/*; do
  if [ -d "$skill_dir" ]; then
    skill_name=$(basename "$skill_dir")
    target="$CLAUDE_DIR/skills/$skill_name"

    if [ -L "$target" ]; then
      rm "$target"
    elif [ -d "$target" ]; then
      echo "  Skipping $skill_name (already exists as directory)"
      continue
    fi

    ln -s "$skill_dir" "$target"
    echo "  Linked: $skill_name"
  fi
done

# Symlink agents
echo "Linking agents..."
for agent_file in "$CONFIG_DIR/agents"/*.md; do
  if [ -f "$agent_file" ]; then
    agent_name=$(basename "$agent_file")
    target="$CLAUDE_DIR/agents/$agent_name"

    if [ -L "$target" ]; then
      rm "$target"
    elif [ -f "$target" ]; then
      echo "  Skipping $agent_name (already exists)"
      continue
    fi

    ln -s "$agent_file" "$target"
    echo "  Linked: $agent_name"
  fi
done

echo ""
echo "Claude Code setup complete!"
echo ""
echo "Skills available:"
ls -1 "$CLAUDE_DIR/skills" 2>/dev/null || echo "  (none)"
echo ""
echo "Agents available:"
ls -1 "$CLAUDE_DIR/agents" 2>/dev/null || echo "  (none)"
echo ""
echo "Use /code-review, /commit-and-pr, etc. to invoke skills"
echo "Agents will be used automatically based on their descriptions"
