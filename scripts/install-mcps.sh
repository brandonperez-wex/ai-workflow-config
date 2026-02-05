#!/bin/bash
# Install MCP servers for Claude Code
# Usage: ./install-mcps.sh [server...]
#
# Examples:
#   ./install-mcps.sh              # Install all
#   ./install-mcps.sh shadcn       # Install shadcn only
#   ./install-mcps.sh atlassian google

set -e

SERVERS=("$@")

# Default to priority order if none specified
if [ ${#SERVERS[@]} -eq 0 ]; then
  SERVERS=("shadcn" "atlassian" "google" "github")
fi

echo "Installing MCP servers..."
echo ""

install_shadcn() {
  echo "=== shadcn/ui MCP ==="
  echo "The official shadcn MCP is built into the CLI."
  echo ""
  echo "To use:"
  echo "  1. Run 'npx shadcn@latest mcp' in your project"
  echo "  2. Or add to Claude Code: claude mcp add shadcn"
  echo ""
  echo "For the community version with more features:"
  echo "  npx @jpisnice/shadcn-ui-mcp-server"
  echo ""
}

install_atlassian() {
  echo "=== Atlassian MCP (Jira + Confluence) ==="
  echo ""
  echo "Option 1: Official Atlassian Rovo MCP (OAuth 2.1)"
  echo "  Visit: https://www.atlassian.com/platform/remote-mcp-server"
  echo "  Add: claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp"
  echo ""
  echo "Option 2: Open-source mcp-atlassian"
  echo "  pip install mcp-atlassian"
  echo "  Add to Claude Code:"
  echo '  claude mcp add --transport stdio atlassian -- python -m mcp_atlassian'
  echo ""
  echo "Required environment variables:"
  echo "  ATLASSIAN_URL=https://your-domain.atlassian.net"
  echo "  ATLASSIAN_USERNAME=your-email@company.com"
  echo "  ATLASSIAN_API_TOKEN=your-api-token"
  echo ""
  echo "Get API token: https://id.atlassian.com/manage-profile/security/api-tokens"
  echo ""
}

install_google() {
  echo "=== Google Workspace MCP ==="
  echo ""
  echo "Most comprehensive option (Gmail, Drive, Docs, Sheets, Calendar, etc.):"
  echo "  GitHub: https://github.com/taylorwilsdon/google_workspace_mcp"
  echo "  Website: https://workspacemcp.com/"
  echo ""
  echo "Installation:"
  echo "  npx google-workspace-mcp"
  echo ""
  echo "Or add directly to Claude Code:"
  echo "  claude mcp add --transport http google https://workspace.googleapis.com/mcp"
  echo ""
  echo "Requires OAuth 2.0 setup with Google Cloud Console."
  echo "See: https://workspacemcp.com/docs/setup"
  echo ""
}

install_github() {
  echo "=== GitHub MCP ==="
  echo ""
  echo "Note: You already have 'gh' CLI which covers most GitHub operations."
  echo ""
  echo "For enhanced MCP integration:"
  echo "  claude mcp add --transport http github https://api.github.com/mcp"
  echo ""
  echo "Or use the official GitHub MCP server:"
  echo "  npx @modelcontextprotocol/server-github"
  echo ""
  echo "Required:"
  echo "  GITHUB_TOKEN=ghp_your_token"
  echo ""
}

# Run installations
for server in "${SERVERS[@]}"; do
  case "$server" in
    shadcn)
      install_shadcn
      ;;
    atlassian)
      install_atlassian
      ;;
    google)
      install_google
      ;;
    github)
      install_github
      ;;
    *)
      echo "Unknown server: $server"
      ;;
  esac
  echo "---"
  echo ""
done

echo "MCP installation guide complete!"
echo ""
echo "To verify installed MCPs:"
echo "  claude mcp list"
echo ""
echo "To debug MCP in Claude Code:"
echo "  /mcp"
