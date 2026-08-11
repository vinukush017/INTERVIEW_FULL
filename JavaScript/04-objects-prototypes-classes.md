# Objects, Prototypes, and Classes

## Objects

An object is a collection of keyed properties. Keys are strings or symbols. Property access can use dot notation or bracket notation; bracket notation is required for computed keys and keys that are not valid identifiers.

```js
const key = "role";
const user = { name: "Asha", [key]: "developer" };
```

Use `Object.hasOwn(object, key)` when you need to know whether a property belongs directly to an object. The `in` operator also checks the prototype chain.

## Destructuring and spread

Object destructuring extracts properties. Object spread creates a shallow copy of enumerable own properties.

```js
const original = { name: "Asha", settings: { theme: "dark" } };
const copy = { ...original };
copy.settings.theme = "light";
// original.settings.theme is now also "light" because settings was shared.
```

## Prototype chain

Every ordinary object has an internal prototype link, which is either another object or `null`. If a property is not found directly, JavaScript searches this chain until it finds the property or reaches `null`.

Functions used as constructors have a `.prototype` object. Instances created with `new Constructor()` use that object as their prototype.

```js
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const person = new Person("Asha");
```

Methods placed on the prototype are shared instead of being recreated for every instance.

## What `new` does

Conceptually, `new Constructor()`:

1. Creates a new object linked to `Constructor.prototype`.
2. Calls the constructor with the new object as `this`.
3. Returns the new object unless the constructor explicitly returns another object.

## Classes

Class syntax provides a clearer way to work with constructor functions and prototypes. It does not replace prototype-based inheritance with a separate inheritance model.

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}
```

Instance methods are stored on the class prototype. `extends` links the child and parent prototype chains. A derived constructor must call `super()` before using `this`.

Private fields use `#name` syntax and are enforced by the language. Static methods belong to the class constructor rather than its instances.

## Composition and inheritance

Inheritance models an “is-a” relationship but can create tight coupling. Composition builds behavior from smaller objects or functions and is often easier to change and test. In interviews, explain the trade-off rather than claiming one is always correct.

## Interview checks

1. Explain property lookup through the prototype chain.
2. Compare `Object.hasOwn` with the `in` operator.
3. What steps does `new` perform?
4. Are JavaScript classes fundamentally separate from prototypes?
5. Where are class instance methods stored?
6. Compare composition with inheritance.

## Practice

- Build a constructor function and then rewrite it as a class.
- Create a subclass that overrides a parent method and also calls `super`.
- Demonstrate own and inherited properties using `Object.hasOwn` and `in`.
