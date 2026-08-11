# Scope, Hoisting, and Closures

## Execution context

When JavaScript runs code, it creates an execution context. The global code gets a global context, and every function call gets a new function context. Each context tracks its variables, the current `this` value, and a link to the outer lexical environment.

JavaScript first prepares declarations and then executes statements. This is the behavior commonly described as hoisting. The source code is not physically moved.

## Scope

Scope determines where a name can be accessed.

- Global scope: available throughout the program.
- Function scope: available inside the function that declared it.
- Block scope: available only inside a block such as `if`, `for`, or `{}`.
- Lexical scope: access is determined by where functions are written, not where they are called.

```js
const outer = "outside";

function showScope() {
  const inner = "inside";
  console.log(outer); // The inner scope can read its outer scope.
}
```

When JavaScript cannot find a variable locally, it searches outward through the scope chain. It never searches inward into a child scope.

## `var`, `let`, and `const`

| Keyword | Scope | Before declaration | Reassignment | Redeclaration in same scope |
| --- | --- | --- | --- | --- |
| `var` | Function | Reads as `undefined` | Yes | Yes |
| `let` | Block | Temporal dead zone | Yes | No |
| `const` | Block | Temporal dead zone | No | No |

Prefer `const` by default and use `let` when the binding must change. Avoid `var` in modern application code because its function scope and redeclaration rules make mistakes easier.

`const` prevents reassignment of the variable; it does not freeze the referenced object.

```js
const user = { name: "Asha" };
user.name = "Ravi"; // Allowed
// user = {};        // Not allowed
```

## Hoisting and the temporal dead zone

Function declarations can be called before their declaration. A `var` declaration exists from the start of its function scope and initially contains `undefined`. A `let`, `const`, or `class` binding also exists before its declaration but cannot be accessed until execution reaches that declaration. That inaccessible period is the temporal dead zone.

```js
console.log(score); // undefined
var score = 10;

// console.log(name); // ReferenceError
let name = "Mina";
```

Function expressions follow the rules of the variable holding them. A function stored in `const` cannot be called before that declaration is initialized.

## Closures

A closure is a function together with access to the lexical environment where it was created. The function retains access to those outer variables even after the outer function has returned.

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```

Closures are used for private state, callbacks, event handlers, memoization, currying, and function factories. They retain referenced state, so keeping unnecessary closures alive can also retain memory.

## Classic loop question

`var` creates one function-scoped binding shared by all callbacks. `let` creates a new binding for each loop iteration.

```js
for (let i = 0; i < 3; i += 1) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

## Interview checks

1. Explain hoisting without saying that JavaScript physically moves code.
2. Why does accessing `let` before its declaration throw instead of returning `undefined`?
3. Why can a `const` object's properties still change?
4. Explain closure using a real application example.
5. What values are printed by a loop using `var` inside asynchronous callbacks, and why?

## Practice

- Build a counter with private state and `increment`, `decrement`, and `value` methods.
- Build a function that can be called only a specified number of times.
- Write two loop examples that demonstrate the difference between `var` and `let`.
