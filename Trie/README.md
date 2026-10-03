# Trie

## Pattern

A trie shares character prefixes across stored words. Distinguish reaching a
prefix from reaching the end of a complete stored word.

**Recognize it when:** many exact-word and prefix lookups share character paths.

**Complexity:** O(L) per insert/search/prefix lookup for L characters, using
constant-time child lookup; storage depends on total inserted characters.

**Watch out for:** marking word endings, shared prefixes and repeated inserts.
Attempt before reading a solution.

---

- [Implement Trie (Prefix Tree)](./implement-trie-prefix-tree.js)

Track completion only in [the DSA guide](../01-DSA-Questions.md).
