# Arrays, Collections, and Copying

## Common array methods

Know what each method returns and whether it mutates the original array.

| Method | Purpose | Mutates array? |
| --- | --- | --- |
| `map` | Transform every element | No |
| `filter` | Keep matching elements | No |
| `reduce` | Accumulate into one result | No by itself |
| `find` | Return the first matching element | No |
| `some` | Test whether any element matches | No |
| `every` | Test whether all elements match | No |
| `sort` | Sort elements in place | Yes |
| `reverse` | Reverse elements in place | Yes |
| `push` / `pop` | Add/remove at the end | Yes |
| `shift` / `unshift` | Remove/add at the beginning | Yes |
| `slice` | Copy a range | No |
| `splice` | Remove or insert elements | Yes |

Callbacks for `map`, `filter`, and similar methods receive the element, index, and original array. Avoid using `map` only for side effects; use it when you need the returned transformed array.

## Sorting

Default `sort` compares values as strings. Supply a comparator for numbers.

```js
[10, 2, 30].sort();              // [10, 2, 30]
[10, 2, 30].sort((a, b) => a - b); // [2, 10, 30]
```

A negative comparator result places `a` before `b`; a positive result places it after `b`.

## `reduce`

`reduce` receives an accumulator and current value. Supplying an explicit initial accumulator prevents surprising behavior on empty arrays and makes the result type clear.

```js
const total = [1, 2, 3].reduce((sum, value) => sum + value, 0);
```

Do not force `reduce` into code that is clearer as a loop, `map`, or `filter`.

## `Map`, `Set`, `WeakMap`, and `WeakSet`

- `Map` stores key-value pairs and allows keys of any type. It preserves insertion order.
- `Set` stores unique values and is useful for membership checks and deduplication.
- `WeakMap` stores object or non-registered symbol keys without preventing their garbage collection. It is not enumerable.
- `WeakSet` weakly stores objects or non-registered symbols and is not enumerable. Registered symbols (`Symbol.for(...)`) cannot be stored. Check runtime support when using weak symbol references.

Use plain objects for record-like data with known property names. Use `Map` when keys are dynamic, non-string values, or when its collection API improves clarity.

## Shallow and deep copying

Spread syntax, `Array.from`, `slice`, and `Object.assign` create shallow copies. Nested references remain shared.

`structuredClone(value)` deeply clones many built-in data types and handles circular references. It cannot clone functions and some platform-specific objects. JSON serialization is not a general deep-clone solution: it loses values such as `undefined`, does not preserve many built-in types correctly, fails on `BigInt` and circular references, and cannot copy functions.

## Mutation

Mutation is not automatically wrong, but shared mutable state makes behavior harder to reason about. Know whether an API mutates its input and communicate this choice in interviews. Modern JavaScript also has non-mutating alternatives such as `toSorted`, `toReversed`, `toSpliced`, and `with` in supported runtimes.

## Interview checks

1. Which common array methods mutate their input?
2. Why does numeric sorting require a comparator?
3. When would you choose `Map` instead of an object?
4. Why can `WeakMap` not be enumerated?
5. Explain shallow copying with a nested-object example.
6. Why is JSON serialization not a reliable deep clone?

## Practice

- Implement frequency counting using both an object and a `Map`.
- Use `reduce` to group objects by a property.
- Deduplicate an array using `Set` while preserving insertion order.
- Produce a bug caused by a shallow copy, then fix it with an appropriate strategy.
