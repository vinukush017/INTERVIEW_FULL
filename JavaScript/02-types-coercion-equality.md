# Types, Coercion, and Equality

## Primitive and object values

JavaScript has seven primitive types: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`. Everything else is an object, including arrays and functions. Functions are callable objects.

Primitive values are immutable. Variables holding objects store a reference to the object, so two variables can point to the same mutable value.

```js
const first = { score: 1 };
const second = first;
second.score = 2;
console.log(first.score); // 2
```

JavaScript arguments are passed by value. For an object, the value being copied is the reference. A function can mutate that object, but reassigning its local parameter does not reassign the caller's variable.

## `typeof` details

Useful interview cases:

- `typeof undefined` is `"undefined"`.
- `typeof null` is `"object"`, a historical language quirk.
- `typeof []` is `"object"`; use `Array.isArray` for arrays.
- `typeof function () {}` is `"function"`.
- `typeof NaN` is `"number"`.

`NaN` means “not a number” but belongs to the number type. Use `Number.isNaN(value)` to test it reliably.

## Truthy and falsy values

The falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Every object is truthy, including empty arrays and empty objects.

`||` returns its right operand when the left operand is falsy. `??` returns its right operand only when the left operand is `null` or `undefined`.

```js
0 || 10;  // 10
0 ?? 10;  // 0
```

Use `??` when values such as `0`, `false`, or an empty string are valid and should be preserved.

## Equality

Strict equality (`===`) does not perform type coercion. Loose equality (`==`) performs conversions according to language rules. Prefer strict equality unless you intentionally need loose equality and can explain the conversion.

Objects compare by identity, not by contents.

```js
[] === []; // false: two different arrays
```

Important cases:

- `NaN === NaN` is `false`.
- `Object.is(NaN, NaN)` is `true`.
- `0 === -0` is `true`.
- `Object.is(0, -0)` is `false`.
- `null == undefined` is `true`, but neither loosely equals `0`.

## Coercion

The `+` operator performs string concatenation if either converted operand is a string; other arithmetic operators usually convert operands to numbers.

```js
"5" + 2; // "52"
"5" - 2; // 3
```

Explicit conversions such as `Number(value)`, `String(value)`, and `Boolean(value)` make intent clearer than relying on implicit coercion.

## Interview checks

1. List all primitive types.
2. Is JavaScript pass-by-reference? Explain precisely.
3. Why are two identical object literals not strictly equal?
4. Compare `||` with `??`.
5. When is `Object.is` different from `===`?
6. Predict common string-and-number coercion expressions before running them.

## Practice

- Create a table predicting `typeof` for primitives, arrays, objects, and functions.
- Write a default-value example where `||` is incorrect but `??` is correct.
- Implement a shallow object-content comparison and state its limitations.
