## 2026-01-28 - Combined Effects Anti-Pattern
**Learning:** Grouping unrelated side effects (e.g., fetching listings and fetching favorites) in a single `useEffect` causes unnecessary network requests when only one dependency changes.
**Action:** Always split `useEffect` hooks by logical responsibility and specific dependencies to isolate side effects.

## 2026-01-29 - Supabase N+1 Optimization
**Learning:** Fetching related counts (likes/comments) and user-specific state (has_liked) in a loop for each item creates massive N+1 performance bottlenecks.
**Action:** Use Supabase embedded resources for counts (e.g., `likes(count)`) and batch fetch user state using `.in()` queries to reduce O(N) requests to O(1).
