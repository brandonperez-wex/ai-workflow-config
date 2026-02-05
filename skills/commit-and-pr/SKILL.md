---
name: commit-and-pr
description: Stage changes, create commits with good messages, push, and create pull requests. Use when ready to commit or create a PR.
allowed-tools:
  - Bash
  - Read
  - Glob
---

# Commit and PR Workflow

Automate the git workflow from staging to PR creation.

## Commit Flow

### 1. Check Status
```bash
git status
git diff --stat
```

### 2. Stage Changes
- Stage specific files, not `git add .`
- Review what's being staged
- Never stage `.env`, credentials, or large binaries

### 3. Write Commit Message

Use conventional commits format:

```
type(scope): short description

Longer description if needed.

- Bullet points for multiple changes
- Explain WHY, not just WHAT

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes nor adds
- `test`: Adding or updating tests
- `chore`: Build process, dependencies

### 4. Commit
```bash
git commit -m "$(cat <<'EOF'
type(scope): description

Details here.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## PR Flow

### 1. Ensure Branch is Current
```bash
git fetch origin
git rebase origin/main  # or merge
```

### 2. Push
```bash
git push -u origin HEAD
```

### 3. Create PR
```bash
gh pr create --title "type(scope): description" --body "$(cat <<'EOF'
## Summary
- Bullet point summary of changes

## Test Plan
- [ ] How to test this

## Screenshots
(if applicable)

---
Generated with Claude Code
EOF
)"
```

## Guidelines

- One logical change per commit
- Keep PRs focused and reviewable (<400 lines ideal)
- Link to issues: `Fixes #123` or `Closes #123`
- Request specific reviewers if needed
- Draft PRs for work-in-progress: `gh pr create --draft`
