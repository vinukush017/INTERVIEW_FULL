# Trees

## Pattern

Almost everything here is recursive DFS (pre/in/post-order) or iterative BFS
(level order, using a queue). A binary search tree adds one extra rule:
everything in the left subtree is smaller, everything in the right subtree
is larger, for *every* ancestor, not just the immediate parent.

**Recognize it when:** "binary tree", "BST", "depth/height/diameter", "path
sum", "level order traversal", "lowest common ancestor".

**Template:**
```js
function dfs(node) {
  if (!node) return 0; // base case
  const left = dfs(node.left);
  const right = dfs(node.right);
  return 1 + Math.max(left, right);
}
```

**Complexity:** O(n) time (every node visited once); O(h) recursion-stack
space, where h is the tree's height (O(log n) balanced, O(n) worst case).

**Watch out for:** depth (root = 0) vs. height (leaf = 0) are easy to swap by
accident; validating a BST by only comparing a node to its immediate
children is wrong — pass a valid `(min, max)` range down through the
recursion instead.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Invert Binary Tree](./invert-binary-tree.js)
- [Maximum Depth of Binary Tree](./maximum-depth-of-binary-tree.js)
- [Diameter of Binary Tree](./diameter-of-binary-tree.js)
- [Balanced Binary Tree](./balanced-binary-tree.js)
- [Same Tree](./same-tree.js)
- [Subtree of Another Tree](./subtree-of-another-tree.js)
- [Lowest Common Ancestor of BST](./lowest-common-ancestor-of-bst.js)
- [Binary Tree Level Order Traversal](./binary-tree-level-order-traversal.js)
- [Binary Tree Right Side View](./binary-tree-right-side-view.js)
- [Count Good Nodes in Binary Tree](./count-good-nodes-in-binary-tree.js)
- [Validate Binary Search Tree](./validate-binary-search-tree.js)
- [Kth Smallest Element in BST](./kth-smallest-element-in-bst.js)
- [Construct Binary Tree from Preorder and Inorder Traversal](./construct-binary-tree-from-preorder-and-inorder-traversal.js)
- [Symmetric Tree](./symmetric-tree.js)
- [Path Sum](./path-sum.js)
- [Minimum Depth of Binary Tree](./minimum-depth-of-binary-tree.js)
- [Convert Sorted Array to Binary Search Tree](./convert-sorted-array-to-binary-search-tree.js)
