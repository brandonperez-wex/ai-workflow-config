# Environment Debugging

"Works on my machine" is a symptom, not a diagnosis. Environment bugs live in the gap between what you assume and what actually exists.

**Core principle:** Systematically compare environments. The bug is in the difference.

## When to Use

- Code works locally but fails in CI/staging/production
- Failures only appear on certain machines or OSes
- Secrets, API keys, or credentials aren't propagating
- Config file differences between environments
- "Nothing changed" but something broke (environment did change)

## The Environment Debugging Checklist

Work through this systematically. Don't skip steps — the bug is usually in the step you'd skip.

### 1. Compare Environments

| Check | Local | CI/Failing Env |
|-------|-------|----------------|
| OS and version | | |
| Language runtime version | | |
| Package manager version | | |
| Key dependency versions | | |
| Environment variables | | |
| File system permissions | | |
| Network access | | |
| Available system tools | | |

**How to gather:**

```bash
# Runtime
node --version  # or python --version, go version, etc.
npm --version   # or pip --version, cargo --version

# OS
uname -a

# Environment variables (sanitize secrets!)
env | sort | grep -v -E '(TOKEN|SECRET|KEY|PASSWORD|CREDENTIAL)'

# Permissions
ls -la <relevant-paths>

# Network
curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health
```

### 2. Secrets and Credentials

Most CI failures are secrets issues. Check each layer:

```bash
# Layer 1: Are secrets defined in CI config?
# Check your CI provider's secrets/variables UI

# Layer 2: Are they available in the workflow/job?
echo "SECRET_NAME: ${SECRET_NAME:+SET}${SECRET_NAME:-UNSET}"

# Layer 3: Are they propagated to the build script?
# Add to your build script:
echo "=== Env vars in build script: ==="
env | grep -c SECRET_NAME  # Count, don't print value

# Layer 4: Are they reaching the code?
# Add temporary debug logging (remove after fixing!)
```

**Common secrets failures:**
- Secret defined but not exposed to the job/step
- Secret name has a typo (case-sensitive!)
- Secret expired or rotated
- Secret contains special characters that need escaping
- Secret available in main branch but not in PRs (security restriction)

### 3. Dependency Differences

```bash
# Node.js: Compare lock files
diff <(git show main:package-lock.json | jq '.packages | keys[]') \
     <(jq '.packages | keys[]' package-lock.json)

# Python: Compare installed packages
pip freeze > /tmp/local-deps.txt
# Compare with CI output

# Check for native dependencies
npm ls --all 2>&1 | grep -i "optional\|native\|binding"
```

**Common dependency failures:**
- Lock file out of sync with package.json
- Native dependency needs system library not available in CI
- Different architecture (arm64 vs x86_64)
- Peer dependency version mismatch

### 4. File System Differences

```bash
# Check if expected files exist
ls -la <expected-files>

# Check working directory
pwd

# Check file permissions
stat <file>

# Check disk space (CI containers can run out)
df -h
```

**Common file system failures:**
- Working directory is different than expected
- File generated locally but not committed (and not generated in CI)
- Path separator differences (Windows vs Unix)
- Case sensitivity (macOS is case-insensitive, Linux is case-sensitive)
- Temp directory location or cleanup behavior

### 5. Timing and Order

```bash
# Check if services are ready
curl --retry 5 --retry-delay 2 http://localhost:5432/health

# Check if build artifacts exist before tests run
ls -la dist/ build/ .next/
```

**Common timing failures:**
- Test runs before database is ready
- Build step didn't complete before test step
- Parallel jobs accessing shared resource
- Cache from previous run interfering

## Decision Tree

```
"Works locally, fails in CI"
  → Same error message?
    → YES: Check env vars, secrets, dependencies
    → NO: Different runtime version or OS
      → Check runtime versions
      → Check OS-specific behavior

"Fails intermittently in CI"
  → Same test each time?
    → YES: Likely a resource issue (timing, memory, disk)
    → NO: Likely test pollution or ordering
      → See find-polluter.sh

"Worked yesterday, fails today"
  → Code changed?
    → YES: Use git-bisect.md
    → NO: Environment changed
      → CI image updated?
      → Dependency auto-updated?
      → Secret expired?
      → External service changed?
```

## After Finding the Difference

Once you know WHAT differs between environments:

1. **Fix at the right level** — If it's a missing env var, add it to CI config. Don't work around it in code.
2. **Document the requirement** — Add to README or CI config comments: "Requires X env var" or "Needs Node 20+."
3. **Add a pre-flight check** — Make the app fail fast with a clear error if the environment is wrong, instead of failing cryptically later.
