# LinkedList

## Pattern

Pure pointer manipulation. A dummy head node removes special-casing for
"what if the head itself changes"; a fast pointer moving 2 steps for every 1
step of a slow pointer finds cycles, midpoints, and "nth from the end" in a
single pass.

**Recognize it when:** "reverse a list", "merge sorted lists", "detect a
cycle", "find the middle / nth node from the end", "reorder in place".

**Template:**
```js
let prev = null, curr = head;
while (curr) {
  const next = curr.next;
  curr.next = prev;
  prev = curr;
  curr = next;
}
// prev is the new head
```

**Complexity:** O(n) time, O(1) extra space (recursive versions cost O(n)
stack space instead).

**Watch out for:** overwriting `curr.next` before you've saved it into
`next` loses the rest of the list; always add a `dummy = { next: head }`
node when the head itself might be removed or replaced, so you never need a
special case for it.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Reverse Linked List](./reverse-linked-list.js)
- [Merge Two Sorted Lists](./merge-two-sorted-lists.js)
- [Linked List Cycle](./linked-list-cycle.js)
- [Remove Nth Node From End of List](./remove-nth-node-from-end-of-list.js)
- [Reorder List](./reorder-list.js)
- [Copy List With Random Pointer](./copy-list-with-random-pointer.js)
- [Add Two Numbers](./add-two-numbers.js)
- [LRU Cache](./lru-cache.js)
- [Middle of the Linked List](./middle-of-the-linked-list.js)
- [Palindrome Linked List](./palindrome-linked-list.js)
- [Intersection of Two Linked Lists](./intersection-of-two-linked-lists.js)
- [Remove Duplicates from Sorted List](./remove-duplicates-from-sorted-list.js)
