# Google Workspace MCP Setup

## Overview

Access Gmail, Drive, Docs, Sheets, Calendar, and more through MCP.

Recommended: [Taylor Wilsdon's Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) - most comprehensive implementation.

## Prerequisites

- Google Cloud Console project
- OAuth 2.0 credentials
- Enabled APIs for services you want to use

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Note your Project ID

## Step 2: Enable APIs

Enable these APIs in your project:
- Gmail API
- Google Drive API
- Google Docs API
- Google Sheets API
- Google Calendar API
- Google Tasks API

## Step 3: Create OAuth Credentials

1. Go to APIs & Services > Credentials
2. Create Credentials > OAuth client ID
3. Application type: Desktop application
4. Download the credentials JSON

## Step 4: Install MCP Server

### Option A: NPX (Quick Start)

```bash
npx google-workspace-mcp
```

Follow OAuth flow in browser.

### Option B: Installed Package

```bash
npm install -g google-workspace-mcp
```

### Option C: From Source

```bash
git clone https://github.com/taylorwilsdon/google_workspace_mcp
cd google_workspace_mcp
npm install
npm run build
```

## Step 5: Add to Claude Code

```bash
claude mcp add --transport stdio google -- npx google-workspace-mcp
```

Or in `.mcp.json`:

```json
{
  "mcpServers": {
    "google": {
      "type": "stdio",
      "command": "npx",
      "args": ["google-workspace-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}"
      }
    }
  }
}
```

## Capabilities

### Gmail
- Search emails
- Read email content
- Create drafts
- Send emails
- Manage labels

### Drive
- Search files
- Read file content
- Create files/folders
- Share files

### Docs
- Read documents
- Create documents
- Edit content

### Sheets
- Read spreadsheets
- Create spreadsheets
- Update cells

### Calendar
- List events
- Create events
- Update events

## Usage Examples

```
Find emails from john@company.com about "quarterly report"
Create a draft reply to the latest email from my manager
List all files in my "Projects" folder
Create a new Google Doc titled "Meeting Notes - Feb 5"
What's on my calendar tomorrow?
```

## Troubleshooting

### OAuth errors

- Ensure redirect URI matches configuration
- Check credentials are for "Desktop application" type
- Verify required scopes are requested

### API quota limits

- Default quotas are usually sufficient
- Request quota increase if needed
- Implement exponential backoff for retries

### Permission denied

- Re-run OAuth flow to refresh tokens
- Check API is enabled in Cloud Console
- Verify account has access to requested resource
