## 2026-01-28 - Combined Effects Anti-Pattern
**Learning:** Grouping unrelated side effects (e.g., fetching listings and fetching favorites) in a single `useEffect` causes unnecessary network requests when only one dependency changes.
**Action:** Always split `useEffect` hooks by logical responsibility and specific dependencies to isolate side effects.

## 2026-01-28 - PostgREST N+1 Optimization
**Learning:** Fetching related counts (likes/comments) and user-specific state (has_liked) in a loop using `Promise.all` causes massive N+1 performance issues.
**Action:** Use PostgREST's embedded resources `table(count)` for aggregates and batch fetch user-specific state using `.in()` queries.
