## 2026-01-28 - Combined Effects Anti-Pattern
**Learning:** Grouping unrelated side effects (e.g., fetching listings and fetching favorites) in a single `useEffect` causes unnecessary network requests when only one dependency changes.
**Action:** Always split `useEffect` hooks by logical responsibility and specific dependencies to isolate side effects.

## 2026-01-28 - Supabase N+1 Optimization
**Learning:** Avoid fetching related counts (likes, comments) and user-specific state (has_liked) in loops. Use embedded resources `select('*, likes(count)')` for global counts and batch `.in('id', ids)` queries for user-specific state.
**Action:** Always verify network requests for lists and refactor to 1-2 queries using Supabase features.
