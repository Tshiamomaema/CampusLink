## 2026-01-28 - Combined Effects Anti-Pattern
**Learning:** Grouping unrelated side effects (e.g., fetching listings and fetching favorites) in a single `useEffect` causes unnecessary network requests when only one dependency changes.
**Action:** Always split `useEffect` hooks by logical responsibility and specific dependencies to isolate side effects.

## 2026-01-29 - Supabase N+1 Optimization
**Learning:** Fetching related counts (likes/comments) and user-specific status (liked?) for each item in a list using `Promise.all` + `.map` creates a massive N+1 bottleneck.
**Action:** Use Supabase embedded resources `.select('*, likes(count)')` for counts and batch fetch user-specific relations with `.in('post_id', ids)` for O(1) extra requests instead of O(N).
