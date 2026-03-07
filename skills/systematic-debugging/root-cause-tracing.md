# Root Cause Tracing

Bugs manifest deep in the call stack. Your instinct is to fix where the error appears. That's treating a symptom.

**Core principle:** Trace backward through the call chain until you find the original trigger, then fix at the source.

## When to Use

- Error happens deep in execution (not at entry point)
- Stack trace shows a long call chain
- Unclear where invalid data originated
- Need to find which caller is passing bad values

## The Tracing Process

### 1. Observe the Symptom

```
Error: git init failed in /Users/dev/project/packages/core
```

### 2. Find the Immediate Cause

**What code directly causes this?**

```typescript
await execFileAsync('git', ['init'], { cwd: projectDir });
```

### 3. Ask: What Called This?

```
WorktreeManager.createSessionWorktree(projectDir, sessionId)
  → called by Session.initializeWorkspace()
  → called by Session.create()
  → called by test at Project.create()
```

### 4. Keep Tracing Up

**What value was passed?**
- `projectDir = ''` (empty string!)
- Empty string as `cwd` resolves to `process.cwd()`
- That's the source code directory — not a temp directory

### 5. Find the Original Trigger

**Where did the empty string come from?**

```typescript
const context = setupCoreTest(); // Returns { tempDir: '' }
Project.create('name', context.tempDir); // Accessed before beforeEach ran!
```

**Root cause:** Top-level variable initialization accessing a value that hasn't been set yet.

## Adding Stack Traces for Investigation

When you can't trace manually, add instrumentation:

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  console.error('DEBUG git init:', {
    directory,
    cwd: process.cwd(),
    stack,
  });

  await execFileAsync('git', ['init'], { cwd: directory });
}
```

**Use `console.error()` in tests** — logger output may be suppressed.

**Run and capture:**

```bash
npm test 2>&1 | grep 'DEBUG git init'
```

**Analyze the stack trace:**
- Look for test file names in the stack
- Find the line number triggering the call
- Identify the pattern (same test? same parameter? same caller?)

## Finding Which Test Causes Pollution

If something appears during tests but you don't know which test creates it, use the `find-polluter.sh` script in this directory:

```bash
./find-polluter.sh '.git' 'src/**/*.test.ts'
```

Runs tests one-by-one, stops at the first polluter.

## The Key Principle

```
Found immediate cause
  → Can trace one level up? → YES → Trace backwards
    → Is this the source? → NO → Keep tracing
    → Is this the source? → YES → Fix at source
      → Also add validation at each layer (see defense-in-depth.md)
```

**NEVER fix just where the error appears.** Trace back to find the original trigger.

## Stack Trace Tips

- **In tests:** Use `console.error()`, not logger — logger may be suppressed
- **Before the operation:** Log before the dangerous operation, not after it fails
- **Include context:** Directory, cwd, environment variables, timestamps
- **Capture the stack:** `new Error().stack` shows the complete call chain
