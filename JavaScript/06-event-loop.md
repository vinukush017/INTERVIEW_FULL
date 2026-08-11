# Call Stack and Event Loop

## The runtime model

JavaScript executes one stack frame at a time on its main call stack. The surrounding runtime—such as a browser or Node.js—provides timers, network operations, file operations, and queues. These runtime features are not themselves part of the ECMAScript language.

Synchronous function calls are pushed onto the call stack and removed when they return. A long-running synchronous task blocks other JavaScript work on that thread.

## Event-loop idea

Asynchronous APIs arrange for callbacks or promise reactions to be queued later. The event loop allows queued work to run when the current synchronous job has completed and the call stack is empty.

This means a zero-millisecond timer does not run immediately. Its delay is the minimum time before it becomes eligible to be queued.

## Tasks and microtasks

Browsers commonly describe queued work as tasks (often called macrotasks in interview discussions) and microtasks.

- Timer callbacks and many user-interface events run as tasks.
- Promise reactions and `queueMicrotask` callbacks run as microtasks.
- After a task finishes, the runtime drains the microtask queue before moving to the next task.

```js
console.log("A");

setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));

console.log("D");
// A, D, C, B
```

First, synchronous code prints `A` and `D`. The fulfilled-promise reaction is a microtask, so it runs before the timer task.

Microtasks added while draining microtasks are also processed before the next task. An endless stream of microtasks can therefore delay timers and rendering.

## Browser and Node.js differences

The general stack-and-queue explanation applies to both environments, but Node.js has event-loop phases and additional behavior such as `process.nextTick`. Do not assume every ordering edge case is identical across browsers and Node versions. In an interview, state which runtime you are discussing.

## Rendering

In a browser, rendering opportunities occur between tasks, not in the middle of a long synchronous function. Expensive computation can freeze input and visual updates. Common solutions include breaking work into chunks, moving CPU-heavy work to a worker, or optimizing the computation.

## Interview checks

1. Is `setTimeout` part of the JavaScript language?
2. Why does a zero-delay timer run after current synchronous code?
3. Why do promise callbacks usually run before timer callbacks?
4. Can microtasks delay rendering or timers?
5. What does “JavaScript is single-threaded” describe, and what does it not mean?

## Practice

- Predict mixed output containing synchronous logs, timers, promises, and nested microtasks.
- Create an example showing that a long loop delays a timer.
- Explain the event loop in under 60 seconds without using vague phrases such as “async goes somewhere.”
