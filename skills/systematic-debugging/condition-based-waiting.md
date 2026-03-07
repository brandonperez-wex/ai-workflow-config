# Condition-Based Waiting

Flaky tests often guess at timing with arbitrary delays. Tests pass on fast machines, fail under load or in CI.

**Core principle:** Wait for the actual condition you care about, not a guess about how long it takes.

## When to Use

- Tests have arbitrary delays (`setTimeout`, `sleep`, `time.sleep()`)
- Tests are flaky (pass sometimes, fail under load)
- Tests timeout when run in parallel
- Waiting for async operations to complete

**Don't use when:**
- Testing actual timing behavior (debounce, throttle intervals)
- If using a timeout for timed behavior, document WHY

## Core Pattern

```typescript
// ❌ BEFORE: Guessing at timing
await new Promise(r => setTimeout(r, 50));
const result = getResult();
expect(result).toBeDefined();

// ✅ AFTER: Waiting for condition
await waitFor(() => getResult() !== undefined, 'result to be available');
const result = getResult();
expect(result).toBeDefined();
```

## Quick Patterns

| Scenario | Pattern |
|----------|---------|
| Wait for event | `waitFor(() => events.find(e => e.type === 'DONE'))` |
| Wait for state | `waitFor(() => machine.state === 'ready')` |
| Wait for count | `waitFor(() => items.length >= 5)` |
| Wait for file | `waitFor(() => fs.existsSync(path))` |
| Complex condition | `waitFor(() => obj.ready && obj.value > 10)` |

## Implementation

Generic polling function:

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000
): Promise<T> {
  const startTime = Date.now();

  while (true) {
    const result = condition();
    if (result) return result;

    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
    }

    await new Promise(r => setTimeout(r, 10)); // Poll every 10ms
  }
}
```

### Domain-Specific Helpers

Build focused helpers on top of the generic `waitFor`:

```typescript
// Wait for a specific event type
async function waitForEvent<E extends { type: string }>(
  getEvents: () => E[],
  eventType: string,
  timeoutMs = 5000
): Promise<E> {
  return waitFor(
    () => getEvents().find(e => e.type === eventType),
    `${eventType} event`,
    timeoutMs
  );
}

// Wait for N events of a given type
async function waitForEventCount<E extends { type: string }>(
  getEvents: () => E[],
  eventType: string,
  count: number,
  timeoutMs = 5000
): Promise<E[]> {
  return waitFor(
    () => {
      const matching = getEvents().filter(e => e.type === eventType);
      return matching.length >= count ? matching : undefined;
    },
    `${count} ${eventType} events`,
    timeoutMs
  );
}

// Wait for event matching a predicate
async function waitForEventMatch<E>(
  getEvents: () => E[],
  predicate: (event: E) => boolean,
  description: string,
  timeoutMs = 5000
): Promise<E> {
  return waitFor(
    () => getEvents().find(predicate),
    description,
    timeoutMs
  );
}
```

## Before and After

```typescript
// ❌ BEFORE (flaky — 60% pass rate):
const messagePromise = agent.sendMessage('Execute tools');
await new Promise(r => setTimeout(r, 300)); // Hope tools start in 300ms
agent.abort();
await messagePromise;
await new Promise(r => setTimeout(r, 50));  // Hope results arrive in 50ms
expect(toolResults.length).toBe(2);         // Fails randomly

// ✅ AFTER (reliable — 100% pass rate, 40% faster):
const messagePromise = agent.sendMessage('Execute tools');
await waitForEventCount(getEvents, 'TOOL_CALL', 2);  // Wait for tools to start
agent.abort();
await messagePromise;
await waitForEventCount(getEvents, 'TOOL_RESULT', 2); // Wait for results
expect(toolResults.length).toBe(2);                    // Always succeeds
```

## When Arbitrary Timeout IS Correct

```typescript
// Tool ticks every 100ms — need 2 ticks to verify partial output
await waitForEvent(getEvents, 'TOOL_STARTED');     // First: wait for condition
await new Promise(r => setTimeout(r, 200));         // Then: wait for timed behavior
// 200ms = 2 ticks at 100ms intervals — documented and justified
```

**Requirements for using arbitrary timeouts:**
1. First wait for the triggering condition
2. Timeout is based on known timing (not guessing)
3. Comment explains WHY this specific duration

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Polling too fast (`setTimeout(check, 1)`) | Poll every 10ms — fast enough, not wasteful |
| No timeout (loop forever if condition never met) | Always include timeout with clear error message |
| Stale data (cache state before loop) | Call getter inside loop for fresh data each check |
| No description in error | Include what you were waiting for in the timeout error |
