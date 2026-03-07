# Git Bisect — Temporal Debugging

When something used to work and now doesn't, don't stare at the code. Search through time.

**Core principle:** Binary search through commit history to find the exact commit that introduced the bug. O(log n) — roughly 7 tests for 100 commits, 10 for 1000.

## When to Use

- "This worked last week / yesterday / before the deploy"
- Regression bugs where you know a good state existed
- The codebase has changed significantly and you can't eyeball the diff
- You suspect a specific change broke things but aren't sure which one

**Don't use when:**
- Bug has always existed (no known-good state)
- The test is flaky (bisect needs a reliable pass/fail signal)
- Build is broken on many commits (bisect can't test broken builds)

## Manual Bisect

```bash
# Start bisect
git bisect start

# Mark current (broken) commit as bad
git bisect bad

# Mark a known-good commit as good
git bisect good <commit-hash>
# Or by tag/date: git bisect good v1.2.0

# Git checks out a middle commit. Test it.
# If this commit is broken:
git bisect bad

# If this commit works:
git bisect good

# Repeat until git identifies the first bad commit.
# Git will print: "<hash> is the first bad commit"

# When done, return to your branch:
git bisect reset
```

## Automated Bisect

If you have a command that returns exit 0 for good and non-zero for bad:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.2.0

# Automate: git runs this command at each step
git bisect run npm test
# Or a specific test:
git bisect run pytest tests/test_auth.py::test_login
# Or a custom script:
git bisect run ./scripts/check-regression.sh
```

Git handles the binary search automatically and reports the first bad commit.

## Writing a Bisect Test Script

For complex checks, write a script that exits 0 (good) or 1 (bad):

```bash
#!/bin/bash
# check-regression.sh

# Skip commits that don't build (exit 125 = skip)
npm install --silent 2>/dev/null || exit 125
npm run build --silent 2>/dev/null || exit 125

# The actual test
npm test -- --grep "login should work" --silent
# Exit code propagates: 0 = good, non-zero = bad
```

**Exit codes for `git bisect run`:**
- `0` = good commit
- `1-124, 126-127` = bad commit
- `125` = skip this commit (can't test, e.g. doesn't build)
- `128+` = abort bisect

## Tips

- **Find a good commit fast:** Use `git log --oneline` and pick a commit you know worked. Release tags are ideal.
- **Narrow the range first:** If you know the bug appeared this week, start with `git bisect good HEAD~20` instead of searching the entire history.
- **Stash your changes:** Bisect checks out commits. Stash or commit your work first.
- **Handle dependency changes:** If `package-lock.json` changed between good and bad, your test script should run `npm install` before testing.
- **Use with `--first-parent`:** In repos with merge commits, `git bisect start --first-parent` follows only the main branch, skipping intermediate branch commits.

## After Finding the Commit

Once bisect identifies the first bad commit:

1. **Read the commit** — `git show <hash>`. Understand what changed.
2. **Read the commit message** — Often explains the intent, which reveals why it broke.
3. **Diff the commit** — `git diff <hash>~1 <hash>`. The bug is in this diff.
4. **Continue with Phase 1** — Now you know WHERE and WHEN. Trace the root cause from there.
