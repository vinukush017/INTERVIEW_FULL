# Functions and `this`

## Function forms

Function declarations are hoisted with their callable value. Function expressions and arrow functions follow the initialization rules of their variable.

```js
function declared(value) {
  return value * 2;
}

const expressed = function (value) {
  return value * 2;
};

const arrow = (value) => value * 2;
```

Functions are first-class values: they can be stored, passed as arguments, and returned. A higher-order function accepts a function, returns one, or both.

## Parameters

Default parameters apply when an argument is missing or explicitly `undefined`, but not when it is `null`. Rest parameters collect remaining arguments into a real array. Spread syntax expands an iterable into individual arguments.

```js
function total(multiplier = 1, ...values) {
  return values.reduce((sum, value) => sum + value, 0) * multiplier;
}

total(2, ...[1, 2, 3]); // 12
```

## How `this` is selected

For normal functions, `this` is mainly determined by how the function is called:

1. Constructor call: `new Example()` binds `this` to the new instance.
2. Explicit binding: `call`, `apply`, or a function created by `bind` supplies `this`.
3. Method call: `object.method()` binds `this` to the object before the dot.
4. Plain function call: in strict mode, `this` is `undefined`; non-strict browser scripts may use the global object.

```js
const user = {
  name: "Asha",
  showName() {
    return this.name;
  },
};

user.showName(); // "Asha"
```

Assigning a method to a standalone variable loses its method call-site.

```js
const show = user.showName;
// show() no longer receives user as `this`.
```

## Arrow functions and `this`

Arrow functions do not create their own `this`, `arguments`, or `prototype`. They capture `this` lexically from the surrounding scope. This makes them useful for callbacks but usually unsuitable as object methods when the method needs the receiver.

Arrow functions cannot be called with `new`.

## `call`, `apply`, and `bind`

- `call(thisValue, arg1, arg2)` invokes immediately with separate arguments.
- `apply(thisValue, [arg1, arg2])` invokes immediately with an array-like argument list.
- `bind(thisValue, arg1)` returns a new function and can also pre-fill arguments.

`bind` does not execute the function immediately.

## Closures versus `this`

Closures resolve variable names from where a function was defined. `this` in a normal function depends on the call site. These are separate mechanisms and should not be mixed in an explanation.

## Interview checks

1. Compare a function declaration, function expression, and arrow function.
2. State the `this` binding rules in priority order.
3. Why can a method lose its `this` value when passed as a callback?
4. Compare `call`, `apply`, and `bind`.
5. Why should an arrow function usually not be used as a constructor or receiver-dependent method?

## Practice

- Borrow a method from one object using `call`.
- Use `bind` to preserve a method passed as a callback.
- Implement a function that supports partial application.
- Predict `this` in method, nested normal-function, and nested arrow-function examples.
