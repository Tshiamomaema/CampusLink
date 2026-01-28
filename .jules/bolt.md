## 2026-01-28 - Combined Effects Anti-Pattern
**Learning:** Grouping unrelated side effects (e.g., fetching listings and fetching favorites) in a single `useEffect` causes unnecessary network requests when only one dependency changes.
**Action:** Always split `useEffect` hooks by logical responsibility and specific dependencies to isolate side effects.
