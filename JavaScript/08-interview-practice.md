# JavaScript Interview Implementation Practice

For each exercise, first explain the required behavior, edge cases, and trade-offs. Then implement it without copying. Test it with normal and awkward inputs.

## Debounce

Debounce delays execution until calls have stopped for a specified period. Each new call resets the timer. It is useful for search input, resize handling, and work that should happen after activity settles.

Your implementation should preserve the caller's `this` value and arguments. After the basic version, consider:

- returning a method that cancels pending execution;
- supporting an immediate/leading call;
- deciding what happens to the wrapped function's return value.

Interview explanation: debounce groups a burst of calls into usually one call after the quiet period.

## Throttle

Throttle limits execution to at most once per interval while calls continue. It is useful for scroll or pointer events when periodic updates are required.

Decide whether your version invokes on the leading edge, trailing edge, or both. Preserve `this` and arguments, and test calls arriving near interval boundaries.

Interview explanation: throttle allows controlled periodic execution; debounce waits for inactivity.

## `Promise.all`

Implement a simplified function that accepts an iterable of values or promises and returns a promise.

Required behavior:

- preserve input order even if promises fulfill in another order;
- accept non-promise values using promise resolution/assimilation;
- fulfill immediately with an empty array for empty input;
- reject when the first input rejection is observed;
- fulfill only after every input fulfills.

Explain why the remaining underlying operations are not automatically cancelled after rejection.

## Deep clone

Begin by defining what your implementation supports. A recursive clone of plain objects and arrays is a valid first version, but it is not a universal clone.

Possible extensions include `Date`, `Map`, `Set`, symbol keys, property descriptors, prototypes, and circular references using `WeakMap`. Functions generally remain shared rather than cloned. Compare your version with `structuredClone` and explain both sets of limitations.

Do not present `JSON.parse(JSON.stringify(value))` as a complete deep-clone solution.

## Output-based questions

Practise predicting output for:

- closure inside loops using `var` and `let`;
- method calls versus detached functions;
- arrow functions nested inside methods;
- promise callbacks mixed with timers;
- promise chains that return values, return promises, throw, or forget to return;
- shallow copies containing nested objects;
- numeric arrays sorted without a comparator.

For every answer, explain the relevant rule. Guessing the correct output without explaining why is not enough.

## Additional implementation exercises

- Implement `map`, `filter`, and `reduce` behavior without using those methods.
- Implement `once`, memoization, currying, and function composition.
- Implement a small event emitter with subscribe, emit, and unsubscribe.
- Flatten a nested array to a specified depth.
- Group an array of objects by a selected key.
- Limit the number of concurrently running promise-returning tasks.

## Mock-interview completion rule

An exercise is complete when you can clarify requirements, implement a working basic version, test edge cases, state time and space costs where meaningful, and discuss at least one limitation or production concern.
