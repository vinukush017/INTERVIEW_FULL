// Reference content for the "JS Core" dashboard tab. Static data only --
// no problem-solving logic reads this file, and nothing here touches
// progress/checklist state. Safe to extend without affecting the Problems
// tab at all.

const FUNCTION_FORMS = [
  {
    id: "js:form:function-declaration",
    title: "Function Declaration",
    note: "Defined with the function keyword and a name. Before executing the enclosing scope, JavaScript initializes the declaration's binding with its callable function value, so it can be called before its declaration line. Hoisting describes this preparation; the source code is not physically moved. Function expressions become callable only when their assignment runs. Prefer declarations for readable standalone utilities; block declarations are scoped to that block in strict mode/modules.",
    code: `function add(a, b) {\n  return a + b;\n}`,
  },
  {
    id: "js:form:function-expression",
    title: "Function Expression",
    note: "A function created as part of an expression and assigned to a variable -- it exists as a value, not a named declaration. Unlike a function declaration, only the variable itself is hoisted (with var) or given a temporal-dead-zone placeholder (with let/const) -- the function VALUE isn't attached until that line actually runs, so calling it earlier throws a TypeError (var) or ReferenceError (let/const). Useful when you want to conditionally define a function, pass it directly as an argument, or control precisely when it becomes available.",
    code: `const add = function (a, b) {\n  return a + b;\n};`,
  },
  {
    id: "js:form:named-function-expression",
    title: "Named Function Expression",
    note: "Like a function expression, but with an internal name (fact here) that's usable ONLY inside the function body -- the outside world still only knows it as factorial. This internal name lets a function reference itself for recursion even if the outer variable gets reassigned later, and it also gives you a real, readable function name in stack traces and the debugger call stack instead of \"(anonymous)\".",
    code: `const factorial = function fact(n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n};`,
  },
  {
    id: "js:form:arrow-function",
    title: "Arrow Function",
    note: "The concise => syntax. Two big behavioral differences from every other function form: it has no own this, arguments, or prototype -- it captures this lexically from whatever scope it was WRITTEN in, not from how it's called; and it can never be used as a constructor (new arrowFn() throws). A single-expression body (no braces) implicitly returns that expression's value; a braced body needs an explicit return. Best for callbacks (array methods, promise handlers, event listeners) where you want this from the surrounding code, not a new one.",
    code: `const add = (a, b) => a + b;\n\nconst logAndAdd = (a, b) => {\n  console.log(a, b);\n  return a + b;\n};`,
  },
  {
    id: "js:form:object-method-shorthand",
    title: "Object Method Shorthand",
    note: "The methodName() {} syntax defines a method in an object literal. Like a normal function-valued property, its this depends on the call site: object.method() supplies object, while a detached call loses that receiver. The forms are not fully equivalent: shorthand methods cannot be constructors and support super property access; an ordinary function-valued property can be a constructor. Both forms can have an inferred name, so stack-trace naming is not the defining difference.",
    code: `const calculator = {\n  add(a, b) {\n    return a + b;\n  },\n};`,
  },
  {
    id: "js:form:class-method",
    title: "Class Method",
    note: "Methods defined inside a class body live on the class's .prototype, not on each instance -- every object created with new shares the exact same function reference for that method, which is memory-efficient compared to defining functions inside a constructor. Like object methods, this depends on the call site, so the same detachment problem applies: passing instance.method as a bare callback loses its this, which is why you'll often see this.method = this.method.bind(this) in constructors, or class fields written as arrow functions instead.",
    code: `class Calculator {\n  add(a, b) {\n    return a + b;\n  }\n}`,
  },
  {
    id: "js:form:constructor-function-pre-class-style",
    title: "Constructor Function (pre-class style)",
    note: "How JavaScript did OOP before the class keyword (ES2015) -- a normal function, called with new, where methods are attached manually to .prototype so they're shared across instances rather than recreated per object. class syntax is mostly sugar over exactly this pattern underneath. You'll rarely write new code this way today, but recognizing it matters for reading older codebases and for explaining what class is really doing when asked in an interview.",
    code: `function Calculator() {}\nCalculator.prototype.add = function (a, b) {\n  return a + b;\n};`,
  },
  {
    id: "js:form:generator-function",
    title: "Generator Function",
    note: "Declared with function*; calling it doesn't run the body immediately -- it returns an iterator object. Each call to .next() runs the body until the next yield, pauses there, and hands back that value; the next .next() call resumes exactly where it left off. Spreading it ([...range(1,3)]) or a for...of loop drives it to completion automatically. Useful for lazy sequences, custom iteration protocols, and (historically) for writing async-looking code before async/await existed.",
    code: `function* range(start, end) {\n  for (let i = start; i <= end; i++) yield i;\n}\n\n[...range(1, 3)]; // [1, 2, 3]`,
  },
  {
    id: "js:form:async-function",
    title: "Async Function",
    note: "Declared with async function. Two guarantees: it ALWAYS returns a Promise (even if you return 5, the caller gets a Promise that resolves to 5), and inside its body you can use await to pause execution until a Promise settles, without blocking the rest of the program. If the function throws (or an awaited promise rejects and isn't caught), the returned promise rejects with that error instead of throwing synchronously.",
    code: `async function fetchData() {\n  const res = await fetch("/api");\n  return res.json();\n}`,
  },
  {
    id: "js:form:async-arrow-function",
    title: "Async Arrow Function",
    note: "Combines async with arrow syntax -- same Promise-returning and await-enabled behavior as a regular async function, plus the arrow's lexical this. Common for async callbacks (array.map(async (item) => ...)) and class field methods where you want both await support and this bound to the surrounding context, not the caller.",
    code: `const fetchData = async () => {\n  const res = await fetch("/api");\n  return res.json();\n};`,
  },
  {
    id: "js:form:async-generator-function",
    title: "Async Generator Function",
    note: "async function* -- combines the pause-and-resume of a generator with the await-a-promise-per-step ability of async functions. Each yield can be preceded by an await, so you can lazily produce values that each depend on an asynchronous operation (paging through an API, reading a stream). Consume it with for await (const x of gen()), not a plain for...of -- the plain form doesn't know how to wait for each yielded promise.",
    code: `async function* streamNumbers() {\n  for (let i = 0; i < 3; i++) {\n    await new Promise((r) => setTimeout(r, 100));\n    yield i;\n  }\n}\n\nfor await (const n of streamNumbers()) {\n  console.log(n);\n}`,
  },
  {
    id: "js:form:iife-immediately-invoked-function-expression",
    title: "IIFE (Immediately Invoked Function Expression)",
    note: "A function expression wrapped in parentheses and called immediately -- the parentheses around the function keyword are required because JS would otherwise try to parse it as a function DECLARATION, which can't be immediately invoked with a trailing (). Before ES modules and let/const block scoping existed, this was the standard way to create a private scope and avoid leaking variables into the global scope. You'll still see it for scripts that run once, or for isolating a scope in a plain <script> tag with no module system.",
    code: `(function () {\n  console.log("runs immediately");\n})();\n\n// Arrow form\n(() => {\n  console.log("runs immediately");\n})();`,
  },
  {
    id: "js:form:higher-order-function-returns-a-function",
    title: "Higher-Order Function (returns a function)",
    note: "A function is \"higher-order\" if it takes a function as an argument, returns one, or both. This example returns a new function that closes over factor -- every call to multiplier(2) creates a fresh closure remembering its own factor, which is the mechanism behind currying (turning f(a, b) into f(a)(b)) and factory functions that produce customized behavior from a shared template.",
    code: `function multiplier(factor) {\n  return function (value) {\n    return value * factor;\n  };\n}\n\nconst double = multiplier(2);\ndouble(5); // 10`,
  },
  {
    id: "js:form:bound-function-bind",
    title: "Bound Function (.bind)",
    note: "bind(thisArg, ...args) returns a new function without invoking the original. Ordinary calls to a bound normal function use the supplied this value and prepend any bound arguments, which helps preserve a callback's receiver. If the target is constructible, new boundFn() ignores the bound this and creates an instance; bound arguments still apply. Binding an arrow does not change its lexical this.",
    code: `function greet() {\n  return \`Hi, \${this.name}\`;\n}\n\nconst boundGreet = greet.bind({ name: "Asha" });\nboundGreet(); // "Hi, Asha"`,
  },
  {
    id: "js:form:default-rest-parameters",
    title: "Default + Rest Parameters",
    note: "Default parameters (multiplier = 1) kick in only when the argument is MISSING or explicitly undefined -- passing null does not trigger the default, since null is treated as an intentional value, not an absence. Rest parameters (...values) collect every remaining argument into a REAL array (unlike the old arguments object, which is array-LIKE but doesn't have array methods like .map/.reduce without conversion), and must be the last parameter in the list.",
    code: `function total(multiplier = 1, ...values) {\n  return values.reduce((sum, v) => sum + v, 0) * multiplier;\n}\n\ntotal(2, 1, 2, 3); // 12`,
  },
];

const ASYNC_TIMER_FORMS = [
  {
    id: "js:async:basic-settimeout",
    title: "Basic setTimeout",
    note: "Schedules a callback to run once after a delay threshold, not at a guaranteed exact time. Runtime rules may normalize/clamp the delay, and busy synchronous code can postpone execution. setTimeout(fn, 0) does not interrupt the current job. In a browser, promise reactions already queued during that job run at the microtask checkpoint before a later timer task; this is execution order, not a rule about when the timer is queued.",
    code: `setTimeout(() => console.log("runs after ~1000ms"), 1000);`,
  },
  {
    id: "js:async:cleartimeout",
    title: "clearTimeout",
    note: "setTimeout returns a numeric id in a browser or a Timeout object in Node.js. Pass that handle to clearTimeout to cancel a callback that has not started, even if its delay threshold has elapsed while synchronous work kept it waiting. Cancellation cannot undo an already running/completed callback. Clearing an inactive handle is a no-op. Debounce uses this to cancel the previous pending timer before starting another.",
    code: `const id = setTimeout(() => console.log("will not run"), 1000);\nclearTimeout(id);`,
  },
  {
    id: "js:async:setinterval-clearinterval",
    title: "setInterval / clearInterval",
    note: "Like setTimeout, but repeats every interval milliseconds until explicitly stopped with clearInterval. A very common bug is starting an interval and never storing/clearing its id, which leaks a timer that keeps firing forever (and keeps its closure's variables alive) even after the component or feature that started it is gone. Always design the stop condition (a max count, a cleanup function, a component-unmount hook) before you start the interval, not as an afterthought.",
    code: `let count = 0;\nconst id = setInterval(() => {\n  count++;\n  console.log(count);\n  if (count === 3) clearInterval(id);\n}, 500);`,
  },
  {
    id: "js:async:promise-based-delay-sleep",
    title: 'Promise-based delay ("sleep")',
    note: "JavaScript has no built-in sleep() -- this pattern wraps setTimeout in a Promise so you can await a pause inside an async function. The executor calls resolve (with no value) once the timer fires, which settles the promise and lets any awaiting code resume. It's the standard building block for retry-with-backoff, rate limiting, and any \"wait N ms, then continue\" logic in async code.",
    code: `const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nasync function run() {\n  console.log("start");\n  await sleep(1000);\n  console.log("1 second later");\n}`,
  },
  {
    id: "js:async:sequential-vs-concurrent-async-calls",
    title: "Sequential vs concurrent async calls",
    note: "Every await pauses ONLY the function it's inside, but if you await one call and only THEN start the next, the second call's network/timer work can't begin until the first one finishes -- even though they're logically independent. Starting both operations first (calling fetchA() and fetchB() without awaiting either yet) lets their underlying work run in parallel/overlap, and Promise.all just waits for both to finish together. The sequential version isn't wrong, just needlessly slow whenever the two calls don't actually depend on each other's result.",
    code: `// Sequential -- b's fetch doesn't start until a's finishes\nasync function sequential() {\n  const a = await fetchA();\n  const b = await fetchB();\n  return [a, b];\n}\n\n// Concurrent -- both requests start immediately\nasync function concurrent() {\n  const [a, b] = await Promise.all([fetchA(), fetchB()]);\n  return [a, b];\n}`,
  },
  {
    id: "js:async:error-handling-in-async-await",
    title: "Error handling in async/await",
    note: "A try/catch around an await behaves exactly like around a synchronous throw: if the awaited promise rejects, control jumps to catch with that rejection reason as the error. Deciding whether to swallow the error (return a fallback) or throw error again (propagate it to whoever called this function) is a real design choice -- silently swallowing errors without at least logging them is one of the most common async bugs, since failures disappear instead of surfacing.",
    code: `async function safeFetch() {\n  try {\n    return await fetchData();\n  } catch (error) {\n    console.error("failed:", error.message);\n    throw error;\n  }\n}`,
  },
  {
    id: "js:async:debounce-wraps-settimeout",
    title: "Debounce (wraps setTimeout)",
    note: "Groups a rapid burst of calls into a single execution, fired only after activity has stopped for delay ms -- every new call cancels the previous pending timer and starts a fresh one. Classic uses: search-as-you-type (don't fire an API call on every keystroke, wait until typing pauses), window resize handlers, and auto-save. fn.apply(this, args) preserves the caller's this and arguments exactly as if fn had been called directly, which matters if the debounced function is used as an object method.",
    code: `function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}`,
  },
  {
    id: "js:async:throttle-wraps-settimeout",
    title: "Throttle (wraps setTimeout)",
    note: "Limits execution to at most once per interval, no matter how often calls come in -- unlike debounce, it doesn't wait for calls to STOP, it just enforces a minimum gap between executions. This version fires on the leading edge (immediately on the first call, then ignores further calls until the cooldown ends); other variants also fire a trailing call to capture the last update. Classic uses: scroll/mousemove handlers, rate-limiting button clicks, live-updating a UI without saturating it.",
    code: `function throttle(fn, interval) {\n  let ready = true;\n  return function (...args) {\n    if (!ready) return;\n    ready = false;\n    fn.apply(this, args);\n    setTimeout(() => { ready = true; }, interval);\n  };\n}`,
  },
  {
    id: "js:async:classic-predict-the-output-trap",
    title: 'Classic "predict the output" trap',
    note: "For this snippet, A and D run synchronously, the already-fulfilled promise queues C as a microtask, and B runs in a later timer callback: A, D, C, B. The browser model drains queued microtasks at a checkpoint before the next task. It is not a universal priority chart for every async operation: a still-pending promise may settle after a timer. Node.js also has event-loop phases and process.nextTick; state the runtime and module context for more complex ordering questions.",
    code: `console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");\n\n// Output: A, D, C, B`,
  },
];

const THEORY_CARDS = [
  {
    category: "Scope & Variables",
    id: "js:question:what-s-the-difference-between-var-let-and-const",
    q: "What's the difference between var, let, and const?",
    a: "var is function-scoped, hoisted and initialized to undefined, and can be redeclared in the same scope. let/const are block-scoped and sit in a \"temporal dead zone\" until their declaration line runs -- accessing them earlier throws instead of returning undefined. const additionally can't be reassigned, though an object or array it holds can still be mutated.",
  },
  {
    category: "Scope & Variables",
    id: "js:question:what-is-hoisting-precisely",
    q: "What is hoisting, precisely?",
    a: "JavaScript scans a scope for declarations before executing it -- the source isn't physically moved. Function declarations are hoisted with their full callable value. var is hoisted and initialized to undefined. let/const/class are hoisted but stay inaccessible (the temporal dead zone) until their declaration line actually executes.",
  },
  {
    category: "Scope & Variables",
    id: "js:question:what-is-a-closure",
    q: "What is a closure?",
    a: "A function bundled together with access to the variables from the lexical scope where it was created, retained even after that outer function has returned. Used for private state, memoization, event handlers, and currying.",
  },
  {
    category: "Scope & Variables",
    id: "js:question:classic-loop-question-what-does-a-var-loop-with-settimeout-print-versus-a-let-loop",
    q: "Classic loop question: what does a var loop with setTimeout print, versus a let loop?",
    a: "for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)) prints 3, 3, 3 -- one shared function-scoped binding, and by the time the callbacks run the loop has already finished with i = 3. The same loop with let prints 0, 1, 2 -- let creates a fresh binding for every iteration.",
  },
  {
    category: "this & Functions",
    id: "js:question:how-is-this-determined-inside-a-normal-function",
    q: "How is `this` determined inside a normal function?",
    a: "By the call site, in priority order: (1) new Fn() binds a brand-new instance; (2) call/apply/bind set it explicitly; (3) obj.method() binds it to obj; (4) a bare function call is undefined in strict mode (or the global object in old non-strict code).",
  },
  {
    category: "this & Functions",
    id: "js:question:why-do-arrow-functions-usually-make-bad-object-methods",
    q: "Why do arrow functions usually make bad object methods?",
    a: "Arrow functions don't have their own this -- they capture it lexically from the scope where they were defined, not from how they're later called. So an arrow method won't see the object it's attached to as this.",
  },
  {
    category: "this & Functions",
    id: "js:question:difference-between-call-apply-and-bind",
    q: "Difference between call, apply, and bind?",
    a: "call(thisArg, a, b) invokes immediately with individual arguments. apply(thisArg, [a, b]) invokes immediately with an array of arguments. bind(thisArg) returns a new function for later use -- it does not call the function immediately.",
  },
  {
    category: "this & Functions",
    id: "js:question:why-can-a-method-lose-its-this-when-passed-as-a-callback",
    q: "Why can a method lose its `this` when passed as a callback?",
    a: "Assigning obj.method to a bare variable (or passing it to setTimeout/addEventListener) detaches it from obj -- when it's later invoked as a plain function call, this is no longer obj. Fix with .bind(obj), an arrow wrapper, or calling it as obj.method().",
  },
  {
    category: "Equality & Types",
    id: "js:question:equality-operators",
    q: "== vs === ?",
    a: "=== (strict equality) compares value and type with no coercion. == (loose equality) coerces both operands to a common type first, following rules that are easy to get wrong. Prefer === unless you specifically need the coercion and can explain it.",
  },
  {
    category: "Equality & Types",
    id: "js:question:why-is-typeof-null-object",
    q: "Why is typeof null === \"object\"?",
    a: "A long-standing bug from JavaScript's earliest implementation, kept for backward compatibility -- it is not a deliberate design choice. null is still a primitive, not an object.",
  },
  {
    category: "Equality & Types",
    id: "js:question:logical-or-vs-nullish",
    q: "|| vs ?? -- when do they differ?",
    a: "|| falls through to its right side on ANY falsy value: 0, \"\", false, null, or undefined. ?? only falls through on null or undefined. Use ?? when 0, false, or \"\" are legitimate values you don't want overridden by a default.",
  },
  {
    category: "Equality & Types",
    id: "js:question:is-javascript-pass-by-value-or-pass-by-reference",
    q: "Is JavaScript pass-by-value or pass-by-reference?",
    a: "Always pass-by-value. For an object argument, the value being copied is the reference itself -- so the callee can mutate the object's contents, but reassigning the local parameter to a new object never affects the caller's variable.",
  },
  {
    category: "Async & Event Loop",
    id: "js:question:does-await-block-the-javascript-thread",
    q: "Does await block the JavaScript thread?",
    a: "No -- it only pauses the current async function. The rest of the program keeps running; the paused function's continuation resumes later via the microtask queue once the awaited promise settles.",
  },
  {
    category: "Async & Event Loop",
    id: "js:question:why-does-a-promise-then-callback-run-before-a-settimeout-fn-0-callback",
    q: "Why does a Promise .then callback run before a setTimeout(fn, 0) callback?",
    a: "In the shown browser snippet, Promise.resolve().then queues a reaction during the current job. That microtask runs before the next timer task. A pending promise need not settle before a timer, so promises do not universally run first. For Node.js, also consider its phases, process.nextTick, and CommonJS versus ES-module context rather than applying a universal browser priority chart.",
  },
  {
    category: "Async & Event Loop",
    id: "js:question:compare-promise-all-allsettled-race-and-any",
    q: "Compare Promise.all, allSettled, race, and any.",
    a: "all: fulfills when every input fulfills, in order; rejects immediately on the first rejection. allSettled: always fulfills, giving a status object for every input, never short-circuits. race: settles as soon as the first input settles, whether fulfilled or rejected. any: fulfills on the first fulfillment; rejects only if every input rejects (with an AggregateError).",
  },
  {
    category: "Async & Event Loop",
    id: "js:question:what-does-javascript-is-single-threaded-actually-mean",
    q: "What does 'JavaScript is single-threaded' actually mean?",
    a: "There is one call stack running one piece of JS code at a time -- it does not mean the runtime has no concurrency. The surrounding environment (browser or Node) provides timers, network I/O, and file I/O off that single thread, and queues their callbacks to run on it later via the event loop.",
  },
  {
    category: "Arrays & Objects",
    id: "js:question:deep-copy-vs-shallow-copy",
    q: "Deep copy vs shallow copy?",
    a: "A shallow copy (spread, Object.assign, .slice()) copies only the top-level properties -- any nested object or array is still the SAME reference in both copies. A deep copy (structuredClone, or a recursive clone) copies nested structures too, so mutating the copy never affects the original at any depth.",
  },
  {
    category: "Arrays & Objects",
    id: "js:question:why-isn-t-json-parse-json-stringify-x-a-safe-deep-clone",
    q: "Why isn't JSON.parse(JSON.stringify(x)) a safe deep clone?",
    a: "It silently drops undefined values, functions, and symbols; throws or breaks on circular references and BigInt; and doesn't correctly preserve special types like Date, Map, or Set (they come back as plain objects or empty objects).",
  },
  {
    category: "Arrays & Objects",
    id: "js:question:which-common-array-methods-mutate-the-array-in-place",
    q: "Which common array methods mutate the array in place?",
    a: "push, pop, shift, unshift, splice, sort, reverse, fill, and copyWithin mutate. map, filter, slice, concat, reduce, find, and the spread operator do not -- they return a new value.",
  },
  {
    category: "Arrays & Objects",
    id: "js:question:what-does-the-prototype-chain-do-on-property-lookup",
    q: "What does the prototype chain do on property lookup?",
    a: "If a property isn't found directly on an object, JavaScript walks up its internal prototype link (object -> prototype -> prototype's prototype -> ... -> null), returning the first match it finds, or undefined if it reaches null without finding one.",
  },
];

// Node uses the same question registry as the browser. IDs stay fixed when wording changes.
if (typeof module !== "undefined") module.exports = { FUNCTION_FORMS, ASYNC_TIMER_FORMS, THEORY_CARDS };
