# Promises and Async/Await

## Promise states

A promise represents the eventual result of an asynchronous operation. It begins pending and becomes either fulfilled with a value or rejected with a reason. Once settled, its state cannot change.

The promise executor runs synchronously when the promise is constructed. Handlers registered with `then`, `catch`, or `finally` run asynchronously as microtasks.

## Chaining

Every call to `then`, `catch`, or `finally` returns a new promise.

- Returning a normal value fulfills the next promise with that value.
- Returning a promise makes the next promise adopt its eventual state.
- Throwing an error rejects the next promise.
- A rejection travels down the chain until a rejection handler handles it.

Always return an inner promise when later steps depend on it. Forgetting the return creates a detached operation and breaks sequencing and error propagation.

```js
fetchUser()
  .then((user) => fetchOrders(user.id))
  .then((orders) => console.log(orders))
  .catch((error) => console.error(error));
```

`finally` is for cleanup. It receives no result argument and normally passes through the previous value or error.

## `async` and `await`

An `async` function always returns a promise. Returning a value fulfills it; throwing rejects it.

`await` pauses only the current async function, not the entire JavaScript thread. The continuation is scheduled through the promise/microtask mechanism.

```js
async function loadOrders() {
  try {
    const user = await fetchUser();
    return await fetchOrders(user.id);
  } catch (error) {
    console.error("Loading failed", error);
    throw error;
  }
}
```

Use `try`/`catch` when you can recover, add useful context, or perform required handling. Do not silently swallow errors.

## Sequential versus concurrent work

Awaiting independent operations one after another makes them sequential. Start independent promises first and await them together when concurrency is safe.

```js
const [user, settings] = await Promise.all([
  fetchUser(),
  fetchSettings(),
]);
```

Concurrency is not the same as parallel CPU execution. It allows operations to overlap while they wait.

## Promise combinators

| Method | Fulfills when | Rejects when | Result |
| --- | --- | --- | --- |
| `Promise.all` | Every input fulfills | First input rejects | Fulfillment values in input order |
| `Promise.allSettled` | Every input settles | Does not reject because an input rejects | Status objects for every input |
| `Promise.race` | First input settles | First settled input rejects | First settled value/reason |
| `Promise.any` | First input fulfills | Every input rejects | First fulfilled value or `AggregateError` |

These methods observe promises; they do not automatically cancel unfinished operations. Cancellation requires support from the underlying operation, commonly through `AbortController` for web APIs.

## Common mistakes

- Using `await` inside `forEach` and expecting the outer code to wait.
- Forgetting to return a promise from a `then` callback.
- Running independent operations sequentially.
- Catching an error and neither handling nor rethrowing it.
- Creating a new promise around an API that already returns a promise.

## Interview checks

1. When does a promise executor run?
2. What does `then` return?
3. How does rejection propagate through a chain?
4. Does `await` block the JavaScript thread?
5. Compare all four major promise combinators.
6. Why does `await array.forEach(async ...)` not wait for its callbacks?

## Practice

- Convert a promise chain to `async`/`await` without changing its error behavior.
- Run three simulated independent requests concurrently.
- Implement retry with a maximum attempt count and delay.
- Use `allSettled` to create a report containing successes and failures.
