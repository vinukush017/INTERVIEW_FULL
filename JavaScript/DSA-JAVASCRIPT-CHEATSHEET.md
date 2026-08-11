# JavaScript Cheat Sheet for DSA Problem Solving

Keep this file open while solving problems. It is a quick syntax and pattern reference, not a list you must memorize before practising.

## Quick lookup

- [Arrays](#arrays)
- [Strings](#strings)
- [Map](#map)
- [Set](#set)
- [Objects](#objects-as-hash-maps)
- [Conversions](#common-conversions)
- [Sorting](#sorting)
- [Numbers and Math](#numbers-and-math)
- [Loops](#useful-loop-forms)
- [Common DSA patterns](#common-dsa-patterns)
- [Time complexity](#common-time-complexities)
- [Common mistakes](#common-javascript-mistakes-in-dsa)

## Arrays

### Create and inspect

```js
const empty = [];
const values = [10, 20, 30];
const fiveZeros = Array(5).fill(0);
const zeroToFour = Array.from({ length: 5 }, (_, index) => index);

values.length;       // 3
values[0];           // 10
values.at(-1);       // 30 (last value)
Array.isArray(values); // true
```

### Add and remove

| Operation | Meaning | Returns | Typical cost |
| --- | --- | --- | --- |
| `arr.push(value)` | Add to end | New length | O(1) amortized |
| `arr.pop()` | Remove from end | Removed value | O(1) |
| `arr.unshift(value)` | Add to beginning | New length | O(n) |
| `arr.shift()` | Remove from beginning | Removed value | O(n) |

```js
const stack = [];
stack.push(10);
stack.push(20);
const top = stack.pop(); // 20
```

For a large queue, avoid repeated `shift()` because it moves remaining elements. Use a head index:

```js
const queue = [];
let head = 0;

queue.push("A");
queue.push("B");
const first = queue[head++]; // "A"

while (head < queue.length) {
  const current = queue[head++];
}
```

### Search and test

```js
const nums = [4, 8, 15, 8];

nums.includes(8);                     // true
nums.indexOf(8);                      // 1
nums.lastIndexOf(8);                  // 3
nums.find((value) => value > 10);     // 15
nums.findIndex((value) => value > 10); // 2
nums.some((value) => value < 0);      // false
nums.every((value) => value > 0);     // true
```

`find` returns a value. `findIndex` returns its index. When nothing matches, they return `undefined` and `-1`, respectively.

### Copy and extract

```js
const nums = [10, 20, 30, 40];

const copy1 = [...nums];
const copy2 = nums.slice();
const middle = nums.slice(1, 3); // [20, 30], end excluded
const merged = [...nums, 50, 60];
const combined = nums.concat([50, 60]);
```

These are shallow copies. Nested objects and arrays remain shared.

### Transform

```js
const nums = [1, 2, 3, 4];

const doubled = nums.map((value) => value * 2);          // [2, 4, 6, 8]
const evens = nums.filter((value) => value % 2 === 0);   // [2, 4]
const sum = nums.reduce((total, value) => total + value, 0); // 10
const text = nums.join("-");                             // "1-2-3-4"
```

Always provide an initial value to `reduce` unless you have a specific reason not to.

### Change part of an array

```js
const nums = [10, 20, 30, 40];

nums.splice(1, 2);       // removes 20 and 30; nums is [10, 40]
nums.splice(1, 0, 25);   // inserts 25; nums is [10, 25, 40]
nums.splice(1, 1, 99);   // replaces one value; nums is [10, 99, 40]
```

`slice(start, end)` does not mutate. `splice(start, deleteCount, ...items)` mutates.

### Other useful methods

```js
[1, [2, [3]]].flat(2);                     // [1, 2, 3]
[1, 2].flatMap((value) => [value, value]);  // [1, 1, 2, 2]
[1, 2, 3].reverse();                        // mutates to [3, 2, 1]
[1, 2, 3].fill(0, 1, 3);                   // mutates to [1, 0, 0]
```

### Mutating versus non-mutating methods

Common mutating methods:

- `push`, `pop`, `shift`, and `unshift`
- `splice`
- `sort` and `reverse`
- `fill` and `copyWithin`

Common non-mutating methods:

- `slice`, `concat`, and spread (`...`)
- `map`, `filter`, and `reduce`
- `find`, `findIndex`, `some`, and `every`
- `includes`, `indexOf`, and `join`
- `flat` and `flatMap`

Modern non-mutating alternatives include `toSorted()`, `toReversed()`, `toSpliced()`, and `with()` when the runtime supports them.

## Strings

Strings are immutable. A string method returns a new string; it does not modify the original.

### Access and search

```js
const text = "javascript";

text.length;             // 10
text[0];                 // "j"
text.at(-1);             // "t"
text.includes("script"); // true
text.indexOf("a");      // 1
text.lastIndexOf("a");  // 3
text.startsWith("java"); // true
text.endsWith("script"); // true
```

### Extract and change

```js
const text = "  Hello World  ";

text.trim();                    // "Hello World"
text.toLowerCase();             // "  hello world  "
text.toUpperCase();             // "  HELLO WORLD  "
text.slice(2, 7);               // "Hello"
text.replace("World", "JS");   // replaces first match
"a-a-a".replaceAll("a", "b"); // "b-b-b"
"ha".repeat(3);                 // "hahaha"
```

Prefer `slice`. `substring` also exists, but it handles negative values and reversed arguments differently.

### Split, join, and reverse

```js
const chars = [..."hello"];             // ["h", "e", "l", "l", "o"]
const words = "one two three".split(" "); // ["one", "two", "three"]
const joined = ["a", "b", "c"].join(""); // "abc"
const reversed = [..."hello"].reverse().join(""); // "olleh"
```

`[...text]` handles Unicode code points better than `text.split("")`, although complex user-perceived characters such as some emoji sequences can still contain multiple code points.

### Character codes

Useful for fixed alphabets and index calculations:

```js
"a".charCodeAt(0);                         // 97
String.fromCharCode(97);                    // "a"
const alphabetIndex = "c".charCodeAt(0) - "a".charCodeAt(0); // 2
```

For general Unicode code points, use `codePointAt` and `String.fromCodePoint`.

### Palindrome check

```js
const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");
const isPalindrome = cleaned === [...cleaned].reverse().join("");
```

For optimal extra space, use two pointers instead of constructing a reversed string.

## Map

A `Map` stores key-value pairs. Keys may be strings, numbers, objects, or other values.

### Create a Map

```js
const emptyMap = new Map();

const scores = new Map([
  ["Asha", 90],
  ["Ravi", 85],
]);
```

### Map properties and methods

| Syntax | Purpose |
| --- | --- |
| `map.size` | Number of entries |
| `map.set(key, value)` | Add or replace an entry; returns the map |
| `map.get(key)` | Return the value or `undefined` |
| `map.has(key)` | Check whether a key exists |
| `map.delete(key)` | Delete a key; returns whether it existed |
| `map.clear()` | Delete every entry |
| `map.keys()` | Iterator of keys |
| `map.values()` | Iterator of values |
| `map.entries()` | Iterator of `[key, value]` pairs |
| `map.forEach(callback)` | Visit each entry |

```js
const counts = new Map();

counts.set("a", 1);
counts.set("b", 2);
counts.get("a");      // 1
counts.has("b");      // true
counts.delete("b");   // true
counts.size;           // 1
```

`map.get(key)` returning `undefined` does not prove a key is absent because `undefined` could be a stored value. Use `map.has(key)` when presence matters.

### Loop through a Map

```js
for (const [key, value] of counts) {
  console.log(key, value);
}

for (const key of counts.keys()) {
  console.log(key);
}

for (const value of counts.values()) {
  console.log(value);
}

counts.forEach((value, key) => {
  console.log(key, value);
});
```

Notice that `Map.prototype.forEach` receives `value` before `key`.

### Convert a string to a frequency Map

```js
const text = "banana";
const frequency = new Map();

for (const char of text) {
  frequency.set(char, (frequency.get(char) ?? 0) + 1);
}

// Map { "b" => 1, "a" => 3, "n" => 2 }
```

This is usually what “convert a string to a Map” means in a DSA problem. A direct character-to-index map is different:

```js
const lastIndex = new Map();

for (let index = 0; index < text.length; index += 1) {
  lastIndex.set(text[index], index);
}
```

### Convert a Map to other forms

```js
const entriesArray = [...frequency];          // [["b", 1], ["a", 3], ["n", 2]]
const keysArray = [...frequency.keys()];       // ["b", "a", "n"]
const valuesArray = [...frequency.values()];   // [1, 3, 2]
const plainObject = Object.fromEntries(frequency); // { b: 1, a: 3, n: 2 }
const keyString = [...frequency.keys()].join("");  // "ban"
```

Object conversion is appropriate only when the Map's keys can safely become property keys.

### Common frequency update forms

```js
map.set(value, (map.get(value) ?? 0) + 1); // increment

const nextCount = map.get(value) - 1;
if (nextCount === 0) map.delete(value);
else map.set(value, nextCount);
```

Use `?? 0`, not `|| 0`, when zero or another falsy stored value must be distinguished from a missing value.

## Set

A `Set` stores unique values.

### Create a Set

```js
const emptySet = new Set();
const unique = new Set([1, 2, 2, 3]); // Set { 1, 2, 3 }
```

### Set properties and methods

| Syntax | Purpose |
| --- | --- |
| `set.size` | Number of values |
| `set.add(value)` | Add a value; returns the set |
| `set.has(value)` | Check membership |
| `set.delete(value)` | Delete a value; returns whether it existed |
| `set.clear()` | Delete every value |
| `set.values()` | Iterator of values |
| `set.keys()` | Same iterator as `values()` |
| `set.entries()` | Iterator of `[value, value]` pairs |
| `set.forEach(callback)` | Visit every value |

```js
const seen = new Set();

seen.add(10);
seen.add(20);
seen.has(10);    // true
seen.delete(20); // true
seen.size;       // 1
```

### Remove duplicates

```js
const nums = [1, 2, 2, 3, 3];
const uniqueNums = [...new Set(nums)]; // [1, 2, 3]
```

### Loop through a Set

```js
for (const value of seen) {
  console.log(value);
}

const values = [...seen];
```

### Set operations

The manual forms below work across older runtimes too:

```js
const a = new Set([1, 2, 3]);
const b = new Set([3, 4]);

const union = new Set([...a, ...b]);
const intersection = new Set([...a].filter((value) => b.has(value)));
const difference = new Set([...a].filter((value) => !b.has(value)));
const isSubset = [...a].every((value) => b.has(value));
```

Newer runtimes also provide methods such as `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, and `isDisjointFrom`. Check the interview runtime before depending on them.

### Common duplicate check

```js
const seen = new Set();

for (const value of nums) {
  if (seen.has(value)) {
    return true;
  }
  seen.add(value);
}
```

## Objects as hash maps

Use an object when keys are naturally strings and you want record-like data.

```js
const counts = Object.create(null);

for (const char of "banana") {
  counts[char] = (counts[char] ?? 0) + 1;
}
```

`Object.create(null)` has no prototype, which avoids inherited-key collisions. A normal `{}` is often sufficient when you use `Object.hasOwn` correctly.

### Object methods

```js
const user = { name: "Asha", score: 90 };

Object.keys(user);                 // ["name", "score"]
Object.values(user);               // ["Asha", 90]
Object.entries(user);              // [["name", "Asha"], ["score", 90]]
Object.hasOwn(user, "name");       // true
Object.fromEntries([["a", 1]]);    // { a: 1 }

delete user.score;
```

### Loop through an object

```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

## Common conversions

| From | To | Syntax |
| --- | --- | --- |
| String | Character array | `[...text]` |
| String | Word array | `text.split(" ")` |
| Character array | String | `chars.join("")` |
| Number | String | `String(number)` |
| String | Number | `Number(text)` |
| String | Integer | `Number.parseInt(text, 10)` |
| String | Decimal | `Number.parseFloat(text)` |
| Number | Digit array | `[...String(number)].map(Number)` |
| Digit array | Number | `Number(digits.join(""))` |
| Array | Set | `new Set(array)` |
| Set | Array | `[...set]` |
| Entry array | Map | `new Map(entries)` |
| Map | Entry array | `[...map]` |
| Object | Map | `new Map(Object.entries(object))` |
| Map | Object | `Object.fromEntries(map)` |
| Object keys | Array | `Object.keys(object)` |
| 2D array | Flat array | `matrix.flat()` |

### Reverse common values

```js
const reversedArray = [...array].reverse();
const reversedString = [...text].reverse().join("");
const reversedNumber = Number([...String(number)].reverse().join(""));
```

For a negative integer, handle the sign separately. Reversing with these forms allocates extra space; two-pointer algorithms may avoid that for arrays.

## Sorting

`sort()` mutates the array and compares strings by default.

```js
const ascending = [...nums].sort((a, b) => a - b);
const descending = [...nums].sort((a, b) => b - a);

const wordsAscending = [...words].sort((a, b) => a.localeCompare(b));

const byAge = [...people].sort((a, b) => a.age - b.age);
const byScoreDescending = [...people].sort((a, b) => b.score - a.score);
```

Comparator meaning:

- Negative: place `a` before `b`.
- Positive: place `b` before `a`.
- Zero: keep their relative order in a stable sort.

For interval problems:

```js
intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
```

For strings made of digits, numeric conversion may lose precision for very large values. Compare length first and then lexicographically when needed.

## Numbers and Math

### Number checks and conversion

```js
Number("42");                // 42
Number.parseInt("42px", 10); // 42
Number.parseFloat("3.14kg"); // 3.14
Number.isInteger(42);        // true
Number.isNaN(NaN);           // true
Number.isFinite(10);         // true
Number.MAX_SAFE_INTEGER;
Number.MIN_SAFE_INTEGER;
```

Use `Number.isNaN`, not the coercing global `isNaN`, for a precise check.

### Math methods

```js
Math.abs(-5);         // 5
Math.floor(3.9);      // 3
Math.ceil(3.1);       // 4
Math.round(3.5);      // 4
Math.trunc(-3.9);     // -3
Math.min(4, 2, 8);    // 2
Math.max(4, 2, 8);    // 8
Math.sqrt(25);        // 5
Math.pow(2, 3);       // 8
2 ** 3;               // 8
Math.sign(-10);       // -1
```

For a large array, prefer a loop instead of spreading it into `Math.max(...largeArray)` because function argument limits can be exceeded.

### Useful integer operations

```js
const quotient = Math.floor(a / b);
const remainder = a % b;
const isEven = number % 2 === 0;
const lastDigit = Math.abs(number) % 10;
const withoutLastDigit = Math.trunc(number / 10);
```

JavaScript `number` uses floating-point representation. Integers are exact only through `Number.MAX_SAFE_INTEGER`. Use `BigInt` when a problem requires larger exact integers, but do not mix `number` and `bigint` arithmetic.

## Useful loop forms

### Need the index

```js
for (let index = 0; index < arr.length; index += 1) {
  const value = arr[index];
}
```

### Need only values

```js
for (const value of arr) {
  console.log(value);
}
```

### Need index and value

```js
for (const [index, value] of arr.entries()) {
  console.log(index, value);
}
```

### Iterate backward

```js
for (let index = arr.length - 1; index >= 0; index -= 1) {
  console.log(arr[index]);
}
```

### Iterate object properties

```js
for (const [key, value] of Object.entries(object)) {
  console.log(key, value);
}
```

Avoid `for...in` for arrays. It iterates enumerable property names, not array values, and may include inherited properties.

## Common DSA patterns

### Frequency counter

```js
const frequency = new Map();

for (const value of values) {
  frequency.set(value, (frequency.get(value) ?? 0) + 1);
}
```

Use for anagrams, duplicates, character counts, and occurrence comparisons.

### Complement lookup (Two Sum pattern)

```js
const indexByValue = new Map();

for (let index = 0; index < nums.length; index += 1) {
  const required = target - nums[index];

  if (indexByValue.has(required)) {
    return [indexByValue.get(required), index];
  }

  indexByValue.set(nums[index], index);
}
```

Check before inserting when the two indices must be different.

### Two pointers

```js
let left = 0;
let right = arr.length - 1;

while (left < right) {
  if (conditionIsMet) {
    // Record or return the answer.
  } else if (needLargerValue) {
    left += 1;
  } else {
    right -= 1;
  }
}
```

Often used for sorted arrays, palindromes, pairs, and partitioning.

### Fixed-size sliding window

```js
let windowSum = 0;
let best = -Infinity;

for (let right = 0; right < nums.length; right += 1) {
  windowSum += nums[right];

  if (right >= size) {
    windowSum -= nums[right - size];
  }

  if (right >= size - 1) {
    best = Math.max(best, windowSum);
  }
}
```

### Variable-size sliding window

```js
let left = 0;

for (let right = 0; right < arr.length; right += 1) {
  // Add arr[right] to the window state.

  while (windowIsInvalid) {
    // Remove arr[left] from the window state.
    left += 1;
  }

  // Update the answer using right - left + 1.
}
```

### Prefix sum

```js
const prefix = Array(nums.length + 1).fill(0);

for (let index = 0; index < nums.length; index += 1) {
  prefix[index + 1] = prefix[index] + nums[index];
}

const rangeSum = (left, right) => prefix[right + 1] - prefix[left];
```

The extra leading zero makes range calculations cleaner.

### Stack

```js
const stack = [];
stack.push(value);
const top = stack.at(-1);
const removed = stack.pop();
const isEmpty = stack.length === 0;
```

Use for matching brackets, nested structures, expression evaluation, and monotonic-stack problems.

### Queue / BFS

```js
const queue = [start];
let head = 0;

while (head < queue.length) {
  const current = queue[head++];

  for (const neighbor of getNeighbors(current)) {
    if (visited.has(neighbor)) continue;
    visited.add(neighbor);
    queue.push(neighbor);
  }
}
```

Mark nodes visited when adding them to the queue to prevent duplicate enqueues.

### Matrix creation and directions

```js
const rows = 3;
const columns = 4;
const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
```

Do not create a matrix with `Array(rows).fill(Array(columns).fill(0))`; every row would reference the same array.

### Group values in a Map

```js
const groups = new Map();

for (const item of items) {
  const key = getKey(item);

  if (!groups.has(key)) {
    groups.set(key, []);
  }

  groups.get(key).push(item);
}
```

### Count with a fixed-size alphabet array

```js
const counts = Array(26).fill(0);

for (const char of text) {
  const index = char.charCodeAt(0) - 97;
  counts[index] += 1;
}
```

Use this only when the input is guaranteed to use the expected fixed alphabet.

## Common time complexities

| Operation | Typical time |
| --- | --- |
| Array access by index | O(1) |
| Array `push` / `pop` | O(1) amortized |
| Array `shift` / `unshift` | O(n) |
| Array search (`includes`, `indexOf`, `find`) | O(n) |
| Array `slice`, `map`, `filter`, `reduce` | O(n) |
| Array sorting | O(n log n) |
| Map/Set `get`, `set`, `has`, `add`, `delete` | O(1) average |
| Object property access | O(1) average |
| String slicing or rebuilding | O(n) |

Complexity describes growth, not an absolute guarantee about implementation time. A nested loop is not automatically O(n²); check how often each pointer or element moves overall.

## Common JavaScript mistakes in DSA

### Sorting numbers without a comparator

```js
nums.sort((a, b) => a - b);
```

### Checking a Map value instead of key presence

```js
if (map.has(key)) {
  const value = map.get(key);
}
```

### Sharing every matrix row

```js
// Wrong: rows share one array.
Array(rows).fill(Array(columns).fill(0));

// Correct: each callback creates a new row.
Array.from({ length: rows }, () => Array(columns).fill(0));
```

### Forgetting that strings are immutable

```js
// text[0] = "A" does not change the string.
const changed = `A${text.slice(1)}`;
```

### Returning from inside `forEach`

`return` inside a `forEach` callback does not return from the outer function, and `break` cannot stop `forEach`. Use `for`, `for...of`, `find`, `some`, or `every` when early exit is needed.

### Using `await` with `forEach`

`forEach` does not wait for async callbacks. Use `for...of` for sequential work or `Promise.all(array.map(...))` for concurrent work.

### Confusing `slice` and `splice`

- `slice` copies and does not mutate.
- `splice` removes/inserts and mutates.

### Off-by-one errors

- Array last index: `arr.length - 1`
- Window length with inclusive endpoints: `right - left + 1`
- `slice(start, end)` excludes `end`
- Loop through all indices: `index < arr.length`

### Accidentally using one object as a Map key

Objects used as plain-object keys are converted to property keys, often `"[object Object]"`. Use a real `Map` when object identity must be the key.

## How to use this file effectively

1. Try to recall the operation for one minute.
2. Look it up here if you cannot remember it.
3. Type it yourself rather than copying the entire solution.
4. After solving, write down which syntax you forgot.
5. Recreate that small example from memory the next day.

Looking up syntax is normal. The goal is to gradually need the reference less often while still focusing your interview effort on reasoning and problem-solving.
