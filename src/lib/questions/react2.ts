import { builder } from '../types';

const { out, add } = builder('RB', 'react');

// ───────────────────────── basic ─────────────────────────

add('basic', 'actions', 'In React 19, what can you pass to the `action` prop of a `<form>`?',
	'A function (sync or async) that React calls with the form\'s FormData on submit.',
	['Only a URL string, exactly like plain HTML; functions must go in onSubmit.',
	 'Only a function that calls event.preventDefault() itself to stop the page reload.',
	 'Only a Server Function; client-side functions are rejected at build time.'],
	'React 19 lets `action` (and `formAction` on buttons/inputs) accept a function, which receives a FormData object and runs inside a transition. React prevents the default navigation for you, so no preventDefault is needed. Server Functions are one valid option, but plain client functions work too.',
	`function Rename() {
  async function save(formData: FormData) {
    await updateName(String(formData.get('name')));
  }
  return (
    <form action={save}>
      <input name="name" />
      <button>Save</button>
    </form>
  );
}`);

add('basic', 'actions', 'What does `useActionState(action, initialState)` return?',
	'A tuple: [latest state, a wrapped action to pass to a form, an isPending flag].',
	['A tuple: [state, setState], exactly like useState but with async support, so you destructure it the same way.',
	 'An object { data, error, loading } that mirrors the shape of a fetch library.',
	 'A single promise that resolves to the result of the action.'],
	'The hook wraps your action. The first element is the last value the action returned (or initialState before any run), the second is the function you hand to `<form action>`, and the third says whether the action is in flight. It is not a plain setState pair, and it does not return a promise you await.',
	`const [error, submitAction, isPending] = useActionState(
  async (prev: string | null, formData: FormData) => {
    return (await rename(formData)) ?? null;
  },
  null
);`);

add('basic', 'actions', 'Where must a component that calls `useFormStatus()` be rendered for `pending` to be meaningful?',
	'Inside a <form> as a descendant; it reads the nearest parent form.',
	['Anywhere in the app; it tracks all forms on the page, independent of where the hook component sits.',
	 'In the same component that renders the <form>, right next to it.',
	 'Only inside a component wrapped by a Suspense boundary.'],
	'useFormStatus reads the status of a parent `<form>` like a context. If you call it in the same component that renders the form, there is no parent form above it, so `pending` stays false. The usual fix is to extract a `<SubmitButton>` child that calls the hook.');

add('basic', 'refs', 'In React 19, how does a function component receive a `ref` from its parent?',
	'As a normal prop named ref; forwardRef is no longer needed.',
	['Only through forwardRef; ref is still stripped from props.',
	 'Only through useImperativeHandle with an exposed ref name.',
	 'Through a special second argument to the component function.'],
	'In 19, `ref` is an ordinary prop for function components, so you can destructure it and pass it on. `forwardRef` still works but is no longer necessary and is slated for deprecation. Refs given to class components are not props and still point at the instance.',
	`function Input({ ref, ...props }: React.ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}`);

add('basic', 'context', 'How can you provide a context value in React 19 without `.Provider`?',
	'Render the context itself as the provider: <ThemeContext value={theme}>.',
	['Call ThemeContext.provide(theme) before rendering children, which React then applies to every consumer below.',
	 'Pass the value as a prop named context on the root element.',
	 'Wrap children in <ThemeContext.Consumer value={theme}>.'],
	'React 19 allows `<Context value={...}>` directly. `Context.Provider` still works and will be deprecated in a future version. `Consumer` only reads values and takes a render function, not a value prop.');

add('basic', 'metadata', 'What happens when a component renders `<title>Cart</title>` somewhere deep in the tree in React 19?',
	'React hoists it into the document <head>.',
	['It renders in place inside the body and is ignored by the browser tab.',
	 'It throws, because <title> is only allowed in index.html.',
	 'It is only hoisted if wrapped in a Helmet-style provider component.'],
	'React 19 natively supports `<title>`, `<meta>` and `<link>` in components and hoists them to `<head>`. It works for client-only apps, streaming SSR and Server Components. Libraries like react-helmet can still help with advanced route-level overrides but are not required.');

add('basic', 'use', 'Which statement about the `use` API is true?',
	'It can read a promise or a context, and unlike hooks it may be called inside conditions.',
	['It can only read promises, because use is limited to Suspense-integrated data and cannot read context values.',
	 'It follows the same rules as hooks and must run at the top level.',
	 'It must be wrapped in try/catch to handle rejected promises.'],
	'`use` suspends on a promise or reads a context, and it may be called in if statements and loops, which hooks cannot. It must not be wrapped in try/catch because it throws internally to talk to Suspense. Rejected promises go to the nearest error boundary instead.');

add('basic', 'suspense', 'What does a `<Suspense fallback={...}>` boundary do?',
	'Shows the fallback while any child below it is suspended, then swaps in the real content.',
	['Catches errors thrown by children and renders the fallback, including errors thrown inside their event handlers.',
	 'Delays all rendering of its subtree until the browser is idle.',
	 'Caches the results of fetch calls made by its children.'],
	'A component suspends when it reads data that is not ready (for example `use(promise)` or a lazy component). The closest Suspense boundary above shows its fallback until it is ready. Catching errors is the job of an error boundary, and Suspense does no caching on its own.');

add('basic', 'errors', 'Which component type can currently catch rendering errors of its children as an error boundary?',
	'A class component with static getDerivedStateFromError or componentDidCatch.',
	['Any function component that wraps children in try/catch around the JSX it returns, as in a class render.',
	 'A function component that calls the useErrorBoundary hook.',
	 'Any component placed inside a Suspense boundary.'],
	'React has no built-in hook for error boundaries, so you write a class (or use a library such as react-error-boundary). try/catch inside a function component cannot catch errors thrown by children during their render. Suspense handles loading, not errors.');

add('basic', 'removed-apis', 'In React 19, what replaces `Component.defaultProps` on function components?',
	'ES default parameter values in the destructured props.',
	['A static defaults field that React merges with the passed props.',
	 'The new useDefaults hook.',
	 'PropTypes with a default key.'],
	'`defaultProps` was removed for function components (classes keep it), along with propTypes checking. Use default values while destructuring, such as `function Btn({ size = \'md\' })`. TypeScript already checks prop types at compile time.');

add('basic', 'removed-apis', 'Which API replaces the removed `ReactDOM.render` in React 19?',
	'createRoot from react-dom/client, then root.render().',
	['ReactDOM.mount from react-dom.',
	 'hydrate from react-dom/client for all client apps, including brand new projects.',
	 'renderToString from react-dom/server.'],
	'`ReactDOM.render` (and `hydrate`) were removed. Create a root with `createRoot(container)` and call `root.render(<App />)`; use `hydrateRoot` only to hydrate server-rendered HTML. `renderToString` produces strings on the server and does not mount anything.');

add('basic', 'ids', 'What is `useId` designed for?',
	'Generating stable unique ids that match on server and client, e.g. for label htmlFor and aria attributes.',
	['Generating unique keys for items in a rendered list, replacing the key props that your data would supply.',
	 'Generating random ids for database rows on each render.',
	 'Generating a new id on each render to force remounting.'],
	'useId returns an id that is the same during server rendering and hydration, which avoids mismatches that Math.random() would cause. It is meant for linking elements (label to input, aria-describedby). It must not be used for list keys, which should come from your data.',
	`function Field({ label }: { label: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}`);

add('basic', 'rsc', 'What is a defining limitation of a Server Component?',
	'It cannot use state, effects or browser-only event handlers; it renders on the server only.',
	['It cannot render any child components, only plain HTML tags, and it may not return fragments or arrays.',
	 'It cannot fetch data, because fetching is a client concern.',
	 'It must be marked with \'use server\' at the top of the file.'],
	'Server Components run ahead of time on the server, so they have no useState, useEffect or onClick. They can be async and read data directly. They are the default in RSC frameworks and need no directive; \'use server\' is for Server Functions, not for marking components.');

add('basic', 'rsc', 'What does the `\'use client\'` directive at the top of a file mean?',
	'The file marks the boundary where code becomes part of the client bundle, along with its imports.',
	['That only that single component runs in the browser, while its imports still stay on the server side.',
	 'That the component is rendered only after hydration and never on the server.',
	 'That the file may call Server Functions, which are otherwise forbidden.'],
	'\'use client\' declares a server/client boundary in the module graph: that module and everything it imports are bundled for the client. Client Components are still pre-rendered to HTML on the server on first load. It does not restrict which Server Functions you can call.');

add('basic', 'rsc', 'What does `\'use server\'` mark?',
	'Server Functions that client code can call, which execute on the server.',
	['A component that should run only on the server and never ship any HTML to the browser.',
	 'A module that is excluded from the client bundle for security.',
	 'A function that runs once at build time to generate static data.'],
	'\'use server\' is for Server Functions (functions callable from the client via a network request). It is a common mistake to think it marks Server Components, which need no directive. The call is an HTTP request under the hood, so each function is a public endpoint.');

add('basic', 'portals', 'What is true about events in a tree using `createPortal`?',
	'Events still bubble through the React tree to the portal\'s React parents, not the DOM parents.',
	['Events stop at the portal container and never reach React ancestors.',
	 'Events bubble through the real DOM tree, so React ancestors written above the portal never observe them.',
	 'Portals disable context, so children cannot read parent providers.'],
	'A portal changes where children appear in the DOM, but React keeps them logically under the same parent. Context is available and synthetic events bubble to React ancestors. This is why a click in a modal rendered in document.body can still trigger an onClick on a component that rendered the portal.');

add('basic', 'testing', 'In React 19, where should you import `act` from for tests?',
	'react, using import { act } from \'react\'.',
	['react-dom/test-utils, which remains the primary home.',
	 'react-test-renderer, which is required for act to work.',
	 'It is no longer needed; React 19 batches updates automatically in tests.'],
	'`act` moved from `react-dom/test-utils` (now deprecated, with the other test-utils helpers removed) to the `react` package. React Testing Library wraps interactions in act for you. act is still needed when you update state outside of RTL helpers so tests flush effects before asserting.');

add('basic', 'testing', 'Which React Testing Library query best matches how users and assistive tech find a button?',
	'getByRole(\'button\', { name: /save/i })',
	['getByTestId(\'save-btn\'), which is the recommended first choice.',
	 'container.querySelector(\'.btn-primary\')',
	 'getByText(\'Save\') on the parent div.'],
	'Testing Library guidance is to prefer queries reflecting what users perceive: role with accessible name first. Test ids and class selectors are a last resort because they are invisible to users and break on refactors. getByRole also fails when the semantics are wrong, giving a free accessibility check.');

add('basic', 'testing', 'A button click loads data and then shows a heading. Which query waits for the heading to appear?',
	'await screen.findByRole(\'heading\', { name: /results/i })',
	['screen.getByRole(\'heading\', { name: /results/i }) right after the click.',
	 'screen.queryByRole(\'heading\', { name: /results/i }) with no await.',
	 'await screen.getAllByRole(\'heading\') directly after render.'],
	'findBy queries return a promise that retries until the element shows up or a timeout passes, so they suit async UI. getBy and queryBy run once and getBy throws immediately when the element is not there yet. Awaiting a getBy result does nothing because it is not a promise.');

add('basic', 'transitions', 'What does wrapping a state update in `startTransition` tell React?',
	'The update is non-urgent and can be interrupted by more urgent updates like typing.',
	['The update should run on a web worker thread so it never blocks the page\'s UI.',
	 'The update should be delayed by a fixed amount of time like a debounce.',
	 'The update must be skipped if the component is already rendering.'],
	'Transitions mark updates as low priority so the UI stays responsive. React can start rendering them, pause, and restart if an urgent update (a keystroke) arrives. There is no fixed delay and no worker thread; the work still happens on the main thread.');

add('basic', 'transitions', 'What does `useDeferredValue(value)` return?',
	'A value that can lag behind during urgent updates and catches up in a background render.',
	['A debounced copy that updates only after the user has stopped changing the value for 300ms.',
	 'A promise that resolves with the value later.',
	 'A frozen copy of the first value that never changes.'],
	'During an urgent update React first re-renders with the old deferred value, then schedules a background render with the new one. This lets a heavy child list lag behind a text input without blocking it. It is interruptible and has no fixed time delay.');

add('basic', 'a11y', 'Which is the best way to make a clickable element accessible by default?',
	'Use a <button> element; it gets focus, keyboard activation and role for free.',
	['Use a <div onClick> and add a CSS cursor pointer plus a hover style; browsers treat it as a button.',
	 'Use a <span> with onClick and set tabIndex to -1.',
	 'Use a <div> with role="presentation" and an onClick.'],
	'Native elements provide semantics, focusability and Enter/Space handling without extra code. A div with onClick has none of that. tabIndex -1 removes it from the tab order, and role="presentation" strips semantics, making things worse.');

add('basic', 'hydration', 'Which render code is most likely to cause a hydration mismatch?',
	'Rendering the output of Date.now() or Math.random() directly in JSX.',
	['Rendering a list with stable keys derived from the data that props provide.',
	 'Using useState with a constant initial value.',
	 'Rendering a prop passed from the parent.'],
	'Hydration expects the first client render to produce the same HTML the server sent. Values that differ per call, such as time and random numbers (or typeof window checks), break that. Fix by deriving them in an effect after mount or from data both sides share.',
	`function Clock() {
  return <p>{new Date().toLocaleTimeString()}</p>;
}`);

add('basic', 'perf', 'What does `React.memo(Component)` do?',
	'Skips re-rendering when the parent renders if the props are shallowly equal to last time.',
	['Caches the component output permanently, even if props change, until the page is reloaded.',
	 'Prevents the component from re-rendering when its own state changes.',
	 'Moves the component\'s rendering to a background thread.'],
	'memo compares each prop with Object.is between renders and reuses the previous result when all match. State changes and context changes inside the component still re-render it. It is only an optimization, so it must not be relied on for correctness.');

add('basic', 'removed-apis', 'What happens if you use a string ref like `<input ref="email" />` in React 19?',
	'It is no longer supported; use a ref object from useRef or a callback ref.',
	['It still works, but logs a deprecation warning that you can silence in a config.',
	 'It works only in class components via this.refs.',
	 'It works if the string matches the element id.'],
	'String refs were removed in 19 (legacy context, findDOMNode and ReactDOM.render went too). Use `useRef` and pass the ref object or use a callback ref. Class components also need createRef or callbacks.');

// ───────────────────────── mid ─────────────────────────

add('mid', 'actions', 'What are the arguments of the function you pass to `useActionState`?',
	'The previous state first, then the payload (e.g. FormData) the form submits.',
	['Only the FormData; previous state is kept outside the action in a module-level store.',
	 'The event object first, then the previous state.',
	 'The new state first, then a dispatch function.'],
	'The reducer-like action receives `(previousState, payload)` and returns the next state (or a promise of it). That makes it easy to accumulate or show errors from the last submit. It is not an event handler, so there is no event object.',
	`const [state, action] = useActionState(
  async (prev: { count: number }, formData: FormData) => ({
    count: prev.count + Number(formData.get('n')),
  }),
  { count: 0 }
);`);

add('mid', 'actions', 'After a successful `<form action={fn}>` finishes in React 19, what happens to uncontrolled inputs?',
	'React automatically resets the form, clearing uncontrolled fields to defaults.',
	['Nothing; they keep their typed values unless you call reset() on the form element yourself.',
	 'They are cleared only if the action returns null.',
	 'The page reloads, so all field state is lost.'],
	'For function actions, React resets uncontrolled form fields after the action succeeds (use requestFormReset to trigger it manually). To keep values after a validation error, return them in state and feed them back through defaultValue. There is no full page reload for function actions.');

add('mid', 'actions', 'You want a form to keep the user\'s typed values after the action returns a validation error. What is the idiomatic approach?',
	'Return the submitted values from the action state and set them as defaultValue.',
	['Convert every input to controlled state and disable form actions entirely, using onSubmit.',
	 'Call event.preventDefault() in the action to stop the reset.',
	 'Wrap the action in startTransition so React skips the reset.'],
	'The automatic reset applies to uncontrolled fields, so the action should hand the values back via useActionState and the inputs read them as defaultValue. Function actions get no event to preventDefault, and wrapping in startTransition does not stop the reset.',
	`const [state, action] = useActionState(signup, { error: '', email: '' });
return (
  <form action={action}>
    <input name="email" defaultValue={state.email} />
    <p>{state.error}</p>
  </form>
);`);

add('mid', 'optimistic', 'What happens to a `useOptimistic` value when the surrounding async action finishes?',
	'It reverts to the real state passed in, which should now contain the confirmed result.',
	['It stays as the optimistic value permanently until you reset it manually with another call.',
	 'It merges with the real state using a deep merge.',
	 'It is cleared to undefined until the next render.'],
	'useOptimistic shows a temporary value only while the transition/action is pending. When it ends, React renders the passed-in source state again. On success the source has the new data; on failure it shows the old data, so rollback is automatic.',
	`const [optimisticLikes, addLike] = useOptimistic(likes, (cur, n: number) => cur + n);
async function onLike() {
  addLike(1);
  await api.like(); // then parent updates likes
}`);

add('mid', 'optimistic', 'You call the setter from `useOptimistic` in a plain click handler without a transition or action. What do you get?',
	'A dev warning that the optimistic update happened outside a transition or action.',
	['It works normally and persists until the next render of the parent component finishes.',
	 'A build-time TypeScript error.',
	 'It silently falls back to a normal useState update.'],
	'Optimistic updates are tied to an Action/transition lifetime: that is what tells React when to revert. Call the setter inside startTransition, a form action, or an action prop. Outside of one React warns and the value will not be reverted properly.');

add('mid', 'use', 'What is wrong with calling `use(fetch(\'/api/albums\').then(r => r.json()))` in a Client Component\'s render?',
	'It creates a new promise every render, so it suspends again and never settles.',
	['use() only accepts promises that were created inside Server Components, not client ones.',
	 'fetch cannot be called during rendering in the browser.',
	 'then() returns a non-thenable that use cannot read.'],
	'A promise created during render is a different object on every attempt, so React suspends and retries forever (and warns about an uncached promise). Create the promise outside render (parent, loader, Server Component) or cache it by key, then read it with use.');

add('mid', 'use', 'How should you handle a rejected promise read with `use(promise)`?',
	'Let it throw and handle it with the nearest error boundary.',
	['Wrap the use call in try/catch inside the component.',
	 'Check promise.status before calling use to skip it.',
	 'Return a fallback from use by passing a default as the second argument.'],
	'`use` throws to signal suspending, so a try/catch around it would intercept React\'s own signal. A rejection propagates to the closest error boundary. Reading `promise.status` yourself is discouraged too since it bypasses Suspense optimizations.');

add('mid', 'use', 'Why can `use(ThemeContext)` do something `useContext(ThemeContext)` cannot?',
	'It can be called after an early return or inside conditions.',
	['It subscribes to context changes without re-rendering.',
	 'It can read context outside React components entirely.',
	 'It returns the context value from a parent Server Component.'],
	'use is exempt from the rules of hooks ordering for reading context, so you can skip reading it when not needed. It still re-renders on change and must be called during rendering of a component or hook. It does not bridge server and client contexts.',
	`function Rule({ show }: { show: boolean }) {
  if (!show) return null;
  const theme = use(ThemeContext);
  return <hr className={theme} />;
}`);

add('mid', 'refs', 'What does a ref callback that returns a function do in React 19?',
	'React calls the returned function on detach and does not call the ref with null.',
	['The returned function runs after every render of the component, like an effect with no deps.',
	 'The return value is ignored; cleanup is not supported.',
	 'The returned function becomes the new ref value stored on the element.'],
	'Ref callbacks can return a cleanup function, similar to effects. React calls it when the element is removed or the ref changes, instead of calling the callback with null. This is convenient for observers.',
	`<div
  ref={(el) => {
    const ro = new ResizeObserver(onResize);
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }}
/>`);

add('mid', 'refs', 'With React 19 and TypeScript, why does `<div ref={el => (node = el)} />` now error?',
	'A returned value is treated as cleanup, so use a block body without returning.',
	['Assignments are not allowed inside JSX attributes, only expressions that return a value.',
	 'ref only accepts RefObject, never callbacks, in React 19 types.',
	 'node must be declared with useState instead of let.'],
	'Since any returned function is treated as cleanup, an arrow that implicitly returns the assigned element is ambiguous and the types reject it. Writing `el => { node = el; }` removes the return. A codemod exists for this.');

add('mid', 'stylesheets', 'What does the `precedence` prop on `<link rel="stylesheet">` enable in React 19?',
	'React orders and deduplicates stylesheets and holds back dependent content until they load.',
	['It sets the CSS specificity of the rules in the file, so higher numbers always win style conflicts.',
	 'It makes the browser load the stylesheet as the very first request.',
	 'It inlines the stylesheet into the JavaScript bundle.'],
	'With `precedence`, React manages insertion order in the head, dedupes repeated stylesheets from different components, and in Suspense/streaming waits for the CSS before revealing the content that needs it, avoiding flashes of unstyled content. It has nothing to do with CSS specificity.',
	`<link rel="stylesheet" href="/card.css" precedence="default" />`);

add('mid', 'suspense', 'Two nested Suspense boundaries wrap a component that suspends. Which fallback shows?',
	'The nearest boundary above the suspending component.',
	['The outermost boundary, so the whole page is replaced.',
	 'Both fallbacks show at once, stacked.',
	 'Whichever boundary was declared first in the file.'],
	'Suspense works like a catch: the closest ancestor boundary handles the suspension. Placing boundaries thoughtfully lets you reveal parts of the page progressively rather than blanking everything.');

add('mid', 'suspense', 'A visible list is re-rendered with a new filter inside `startTransition`, and the new list suspends. What does the user see?',
	'The old list stays on screen, with isPending true, instead of the fallback.',
	['The Suspense fallback replaces the list immediately while the new data is loading.',
	 'A blank area until the new data is ready.',
	 'An error because transitions cannot suspend.'],
	'Transitions avoid hiding already-revealed content behind a fallback. React keeps showing the current UI until the new one is ready. Use isPending to show subtle feedback. Without a transition, the update would flip to the fallback.');

add('mid', 'suspense', 'What does streaming SSR with Suspense allow?',
	'The shell is sent first, and suspended parts stream in later when their data is ready.',
	['The server waits for every Suspense boundary to resolve before sending any HTML.',
	 'The server skips rendering suspended parts and the client renders them from scratch after hydration.',
	 'HTML is sent in one chunk, but hydration is delayed.'],
	'With renderToPipeableStream/renderToReadableStream, the HTML outside pending boundaries (the shell) flushes right away with fallbacks, then React streams the remaining chunks and swaps them in. Users see content sooner than if the slowest query blocked everything.');

add('mid', 'errors', 'Which of these errors is NOT caught by an error boundary?',
	'An exception thrown inside an onClick event handler.',
	['A throw in a child\'s render function, while it computes JSX.',
	 'A throw in a child\'s lifecycle method.',
	 'A rejected promise read with use() in a child.'],
	'Error boundaries catch errors during rendering and lifecycles of their children, including rejected promises read via use. Event handlers are not part of rendering, so exceptions there need try/catch (or state to show an error). Async code in effects also needs manual handling.');

add('mid', 'transitions', 'In React 19, you `await` something inside `startTransition(async () => {...})` and then call `setState`. What is the caveat?',
	'Updates after the await are not transitions unless wrapped in another startTransition.',
	['The state update is dropped silently after the await, because the transition already ended.',
	 'It throws unless the function is not async.',
	 'isPending turns false as soon as the await starts.'],
	'Async transitions keep isPending true until the promise settles, but React loses the transition context after the first await. State set after it is treated as a normal update. Wrap it in another startTransition to keep low priority. This is a documented limitation.',
	`startTransition(async () => {
  await save();
  startTransition(() => setSaved(true));
});`);

add('mid', 'transitions', 'What does the second argument in `useDeferredValue(value, initialValue)` do in React 19?',
	'It is returned on the first render, then React re-renders in the background with the real value.',
	['It is a fallback value that React returns whenever the deferred render throws or suspends again.',
	 'It sets how many milliseconds the value is delayed.',
	 'It is the value used when value is undefined.'],
	'`initialValue` lets you render something cheap (like an empty string) on the initial mount, then schedule the real value as a deferred update. It is not a timing option and not an error fallback.',
	`const deferredQuery = useDeferredValue(query, '');`);

add('mid', 'rsc', 'A Server Component renders `<Chart onSelect={(id) => save(id)} />` where `Chart` is a Client Component. What happens?',
	'It errors: an inline function is not serializable across the server-client boundary.',
	['It works; React serializes the function source and sends it to the client to execute it.',
	 'It works, but onSelect only runs on the server.',
	 'It is allowed only when Chart is wrapped in memo.'],
	'Props crossing the boundary must be serializable: primitives, plain objects, arrays, Map/Set, Date, promises, JSX, and Server Functions. A normal closure is not. Define the handler in the client component, or pass a Server Function marked with \'use server\'.');

add('mid', 'rsc', 'Which value can be passed as a prop from a Server Component to a Client Component?',
	'A Date, a Map, or a promise whose resolved value is serializable.',
	['An instance of your own class, such as new Cart(), including its prototype methods.',
	 'A function declared in the Server Component.',
	 'A Symbol created with Symbol(\'id\').'],
	'The RSC protocol supports primitives, Date, Map, Set, typed arrays, plain objects, JSX, promises and Server Functions. Class instances, ordinary functions and non-global symbols are rejected. Promises can be unwrapped in the client with use().');

add('mid', 'rsc', 'A Client Component needs to render a Server Component inside it. What works?',
	'Have a Server Component import both and pass the server one as children or a prop.',
	['Import the Server Component directly in the Client file; it stays on the server there.',
	 'Mark the Server Component with \'use client\' so it can be imported.',
	 'This is impossible; Client Components can never contain server output.'],
	'Importing a component from a \'use client\' file pulls it into the client bundle. But a Server Component can render a Client Component and give it a server-rendered element as children, because JSX elements are serializable. The client component only treats it as an opaque slot.',
	`// page.tsx (server)
<ClientShell>
  <ServerData />
</ClientShell>`);

add('mid', 'server-functions', 'What should you remember about an exported function in a file with `\'use server\'`?',
	'It becomes a public endpoint, so validate input and check authorization inside it.',
	['It is private because only your own client bundle knows its URL, so outsiders cannot call it.',
	 'React automatically checks that the user is authenticated.',
	 'It can only be called from the component that defined it.'],
	'Server Functions are invoked via network requests anyone can replay with crafted arguments. Treat each as an API route: validate with a schema, authenticate and authorize on every call. React does not add an auth layer.');

add('mid', 'compiler', 'What does React Compiler do?',
	'At build time it automatically memoizes components and hook values to skip unneeded re-renders.',
	['It compiles JSX and hooks to native machine code ahead of time, making every component run much faster.',
	 'It removes the need for keys and state by tracking dependencies at runtime.',
	 'It moves component rendering to the server automatically.'],
	'The compiler is a build-time Babel-based tool that analyzes components and inserts fine-grained memoization (like useMemo/useCallback/memo) for you. It does not change semantics or move rendering. It still needs components to follow the Rules of React.');

add('mid', 'compiler', 'What happens when React Compiler finds a component that breaks the Rules of React (for example mutating props)?',
	'It skips optimizing that component and leaves it as is, rather than failing the build.',
	['It fixes the mutation automatically by cloning the props before your component code ever runs.',
	 'It aborts the whole build with a fatal error.',
	 'It memoizes anyway and logs a warning.'],
	'The compiler relies on purity assumptions, so when it detects unsafe patterns it bails out for that component and keeps the original code. The ESLint rules from eslint-plugin-react-hooks surface those violations so you can fix them.');

add('mid', 'compiler', 'How can you exclude a specific component from React Compiler optimization?',
	'Add the \'use no memo\' directive at the top of the function.',
	['Wrap it in React.memo with a custom comparator that always returns true.',
	 'Add an eslint-disable comment above it.',
	 'Rename it to start with a lowercase letter.'],
	'`\'use no memo\'` is the opt-out directive (placed in a function or module). It is a stopgap for debugging or unsupported code. memo and lint comments do not control the compiler.',
	`function Legacy() {
  'use no memo';
  // ...
}`);

add('mid', 'effects', 'In React 19.2, what is `useEffectEvent` for?',
	'Non-reactive Effect logic that reads the latest props/state without becoming a dependency.',
	['Running an effect only on events like click.',
	 'Memoizing an event handler to pass to children.',
	 'Replacing useEffect with a version that runs synchronously before the browser paints each frame.'],
	'An Effect Event is a function called from inside an Effect that always sees the latest values but does not need to be listed in dependencies, so changes to those values do not re-run the effect. It is not a general handler memoizer and should not be passed to other components.',
	`const onConnected = useEffectEvent(() => showToast(theme));
useEffect(() => {
  const c = connect(roomId);
  c.on('connected', onConnected);
  return () => c.disconnect();
}, [roomId]);`);

add('mid', 'activity', 'In React 19.2, what does `<Activity mode="hidden">` do to its children?',
	'Hides them, cleans up their effects, defers updates, and preserves their state.',
	['Unmounts them completely and destroys their state until the mode switches back to visible.',
	 'Keeps all effects running but sets display none.',
	 'Renders them on the server only.'],
	'Activity is a middle ground between conditional rendering and CSS hiding. Hidden children keep component state (and DOM), but effects are cleaned up and updates are processed at lower priority. Setting mode back to visible restores effects. 19.2 supports only visible and hidden.');

add('mid', 'perf', 'A parent re-renders often and passes `style={{ color: \'red\' }}` to a `memo` child. Why does memo not help?',
	'The inline object is a new reference each render, so the shallow prop comparison fails.',
	['memo ignores objects entirely and compares only primitive props, so inline objects never matter.',
	 'memo only works for components with no props.',
	 'Style props are always excluded from memo comparison.'],
	'memo uses Object.is on each prop; a new object literal never equals the previous one. Hoist the constant, memoize with useMemo, or let React Compiler do it. Primitives and stable references pass the comparison.');

add('mid', 'perf', 'A list has 20,000 rows and scrolling is slow. What is the most effective fix?',
	'Virtualize it so only visible rows (plus a buffer) are mounted.',
	['Wrap each row in React.memo and keep rendering every single row at once.',
	 'Move the list state into useRef to avoid renders.',
	 'Wrap the list in Suspense so it renders lazily.'],
	'The cost comes from the sheer number of DOM nodes and components. Windowing libraries (react-window, TanStack Virtual) mount only what is visible. memo trims re-renders but not the mount cost, and Suspense does not split rendering of a synchronous list.');

add('mid', 'perf', 'In the React DevTools Profiler, which feature tells you why a component re-rendered?',
	'Enabling "Record why each component rendered" in the Profiler settings.',
	['The Components tab\'s props editor, which shows the current props and hooks of each component.',
	 'The Network tab\'s request waterfall.',
	 'The Strict Mode toggle in the console.'],
	'The Profiler can record the reason for each commit (props changed, state changed, hooks changed, parent rendered). Use it to find unnecessary renders before reaching for memo. The other options do not report render reasons.');

add('mid', 'errors', 'What is the difference between `onCaughtError` and `onUncaughtError` on `createRoot` in React 19?',
	'onCaughtError fires for errors a boundary caught; onUncaughtError for errors no boundary handled.',
	['onCaughtError is for errors in event handlers; onUncaughtError for errors thrown during render only.',
	 'onCaughtError is for client errors; onUncaughtError for server errors.',
	 'They are aliases kept for backwards compatibility.'],
	'React 19 logs errors once and gives root-level hooks for reporting. `onRecoverableError` is the third: errors React recovered from automatically (like a hydration retry). Use these hooks to send errors to monitoring services.',
	`createRoot(el, {
  onCaughtError: (e, info) => report('caught', e, info.componentStack),
  onUncaughtError: (e, info) => report('uncaught', e, info.componentStack),
}).render(<App />);`);

add('mid', 'hydration', 'A component must show `window.innerWidth`-based UI. What avoids a hydration mismatch?',
	'Render a server-safe default first, then update after mount in an effect.',
	['Read window.innerWidth directly during render with a typeof window guard.',
	 'Add suppressHydrationWarning to the root component.',
	 'Wrap the component in Suspense to skip hydration.'],
	'The server has no window, so reading it in render produces different markup on the client and a mismatch. A typeof guard makes the mismatch happen by design. Set the real value after mount (useEffect or useSyncExternalStore with a server snapshot). suppressHydrationWarning is only for single-element text differences.');

add('mid', 'hydration', 'How are hydration errors reported in React 19 compared to React 18?',
	'As a single error with a diff showing server vs client content.',
	['As multiple separate console warnings with no details about the difference in markup.',
	 'They are silently ignored and the client re-renders.',
	 'They throw and crash the app with a blank page.'],
	'React 19 improved diagnostics: instead of a cascade of warnings it logs one message with a diff (+ client / - server). Hydration also skips unexpected tags that extensions or third-party scripts add to head and body, avoiding needless mismatches.');

add('mid', 'patterns', 'What is the main advantage of the compound components pattern (e.g. `<Tabs><Tabs.List/><Tabs.Panel/></Tabs>`)?',
	'Parts share implicit state through context while the consumer controls layout and composition.',
	['It forces consumers to pass all configuration as props to one single large component instead of children.',
	 'It avoids the need for context or state in the parent.',
	 'It lets React skip rendering unused child components.'],
	'A parent holds state and exposes it via context; sub-components read it. Consumers freely arrange or omit parts without prop drilling. It is a flexible alternative to a monolithic component with dozens of props.');

add('mid', 'patterns', 'Why are custom hooks usually preferred over render props for sharing stateful logic?',
	'They share logic without adding wrapper components or nesting to the tree.',
	['Render props cannot access state at all, because callbacks run outside of any component.',
	 'Hooks make components run on the server only.',
	 'Hooks are faster because React skips diffing for them.'],
	'Render props work but nest JSX and callbacks as you combine several. Hooks compose as plain function calls in a component. Render props are still fine for letting the consumer control rendering of a part, like a virtualized list row.');

add('mid', 'patterns', 'A text input component receives `value` sometimes as a string and sometimes as `undefined`. What does React warn about?',
	'Switching an input between uncontrolled and controlled during its lifetime.',
	['That value must be a number because text input values are always parsed as numbers.',
	 'That inputs cannot be controlled in React 19.',
	 'That undefined is not a valid child.'],
	'An input is controlled if value is not undefined. Changing between the two modes makes React warn because behavior changes mid-life. Initialize with an empty string, or choose one mode and keep it. A good component API supports both via a value/defaultValue pair.');

add('mid', 'testing', 'What is the advantage of `userEvent` over `fireEvent` in Testing Library?',
	'It simulates the full sequence of browser events (focus, keydown, input, click) like a user.',
	['It is fully synchronous, so tests need no await, and it executes faster than every fireEvent call.',
	 'It bypasses React so tests run faster.',
	 'It dispatches only a single synthetic event.'],
	'user-event (v14) is async and models real interactions: typing triggers key events and input changes, clicking moves pointer and focus. fireEvent dispatches one low-level event, which can miss bugs. Create it with userEvent.setup() and await calls.',
	`const user = userEvent.setup();
await user.type(screen.getByRole('textbox'), 'hello');
await user.click(screen.getByRole('button', { name: /send/i }));`);

add('mid', 'testing', 'How do you assert that an element is NOT in the document?',
	'expect(screen.queryByText(\'Error\')).not.toBeInTheDocument()',
	['expect(screen.getByText(\'Error\', { exact: false })).toBeNull()',
	 'expect(screen.findByText(\'Error\')).toBe(false)',
	 'expect(screen.getByText(\'Error\')).not.toBeInTheDocument()'],
	'queryBy returns null when nothing matches, so negative assertions work. getBy throws when it finds nothing, failing before expect runs. findBy returns a promise that rejects if it is absent.');

add('mid', 'dom', 'When is `flushSync` from react-dom appropriate?',
	'When later code needs the DOM already updated, e.g. to measure or scroll to a new element.',
	['To make any state update run faster in general, since it skips the scheduler and renders immediately.',
	 'To run effects before the browser paints on every render.',
	 'To batch several state updates into one render.'],
	'flushSync forces React to apply the update immediately instead of batching it. It hurts performance and opts out of concurrent features, so reserve it for cases where later code depends on the updated DOM. Batching is already the default.',
	`flushSync(() => setItems((xs) => [...xs, item]));
listRef.current?.lastElementChild?.scrollIntoView();`);

add('mid', 'resource-hints', 'What is the difference between `preload` and `preinit` from react-dom?',
	'preload fetches early; preinit also runs the script or applies the stylesheet.',
	['preload is meant for scripts only, while preinit is meant for images and fonts only.',
	 'preinit works only on the server; preload only on the client.',
	 'They are aliases; both add a link tag to the head.'],
	'Both insert hints in the head and dedupe. `preload(url, { as })` just downloads for later use (fonts, images, styles). `preinit(url, { as: \'script\' })` fetches and evaluates it (or inserts the stylesheet) eagerly. Pick based on whether you want execution.');

add('mid', 'custom-elements', 'How does React 19 pass props to a custom element on the client?',
	'It sets a property if the instance has one by that name, otherwise an attribute.',
	['It always sets attributes as strings, so objects and functions get stringified before passing.',
	 'It always sets DOM properties and ignores attributes.',
	 'It requires a wrapper component using refs to set properties.'],
	'React 19 added full custom element support. On the client, a prop matching a property on the instance is assigned as a property (so objects and functions work), else it becomes an attribute. In SSR only primitive values render as attributes.');

add('mid', 'static-apis', 'How does `prerender` from `react-dom/static` differ from `renderToString`?',
	'It waits for Suspense data to finish and returns complete static HTML.',
	['It streams HTML in chunks as data becomes ready.',
	 'It renders only the shell and leaves all Suspense boundaries as fallbacks.',
	 'It runs in the browser to produce a screenshot.'],
	'`prerender` / `prerenderToNodeStream` are for static site generation: they wait for all data, then give the final HTML. `renderToString` does not wait for data and emits fallbacks. For progressive delivery use the streaming APIs instead.');

add('mid', 'actions', 'What does `useFormStatus()` return besides `pending`?',
	'data (the FormData being submitted), method, and action.',
	['error and the result of the last submission, like useActionState.',
	 'The current values of all controlled inputs.',
	 'A reset function for the parent form.'],
	'useFormStatus returns `{ pending, data, method, action }` for the parent form submission. It has no error or result; use useActionState for that. Reading data lets you show what is being submitted while pending.');

add('mid', 'ids', 'You need ids for both an input and its error message in one component. How should you use `useId`?',
	'Call it once and append suffixes to the result for each element.',
	['Call it for every element, since each call returns the same id.',
	 'Use Math.random in addition, as useId only returns a single value.',
	 'Use the result as the key prop for both elements.'],
	'useId returns a unique base string per call site; deriving related ids with suffixes (`id + \'-error\'`) keeps them in sync. Each call returns a different id, and keys should come from data, not useId.');

add('mid', 'suspense', 'How do you code-split a component and show a placeholder while its chunk loads?',
	'Use React.lazy(() => import(\'./X\')) and render it inside a Suspense boundary.',
	['Use dynamic import with await directly in the component body and return the module\'s default.',
	 'Use useEffect to import it and store it in useState.',
	 'Use React.memo with a dynamic import expression.'],
	'`lazy` returns a component that suspends until the module resolves, and the nearest Suspense boundary shows the fallback. The effect+state approach works but loses Suspense integration. Components cannot `await` in render on the client.',
	`const Chart = lazy(() => import('./Chart'));
<Suspense fallback={<Spinner />}>
  <Chart />
</Suspense>`);

add('mid', 'actions', 'In `useActionState(action, initial, permalink)`, what is the optional third argument for?',
	'The URL the form posts to if submitted before hydration, enabling progressive enhancement.',
	['A callback invoked when the action finishes, receiving the final state as its only argument.',
	 'The timeout in milliseconds for the action.',
	 'A key used to cache action results across renders.'],
	'With a Server Function action, the form can submit as a normal POST before JS loads. `permalink` is the page URL React uses for that no-JS case, so the form state is preserved after the server responds. It is only relevant for server-rendered pages.');

// ───────────────────────── advanced ─────────────────────────

add('advanced', 'concurrency', 'Why must component render functions be pure in a concurrent React app?',
	'React may pause, discard and restart renders, so side effects in render could repeat or never commit.',
	['Because concurrent render runs in a worker thread, which cannot access globals or the DOM, so reads fail.',
	 'Because React freezes all objects used during render.',
	 'Because concurrent mode forbids using state in render.'],
	'Concurrent rendering can abandon work in progress (for example when an urgent update arrives) or render more than once (Strict Mode double-render). Mutating outside variables or doing I/O in render leads to inconsistent results. Side effects belong in event handlers or effects.');

add('advanced', 'strict-mode', 'In React 19 Strict Mode (dev), what changes about `useMemo`/`useCallback` during the double render?',
	'The second render reuses memoized results from the first render.',
	['Memoization is disabled so you see every recalculation twice in development.',
	 'They run three times instead of two.',
	 'Nothing; Strict Mode never double-renders memo hooks.'],
	'React 19 changed Strict Mode so that when a component renders twice, useMemo and useCallback reuse the first render\'s results. That better matches production behavior and reduces noise, while still double-invoking your functions to surface impurity.');

add('advanced', 'rsc', 'What does `React.cache` give you in a Server Component tree?',
	'Request-scoped memoization: identical calls with the same args are deduplicated during one render.',
	['A persistent cache shared across all users and requests, which stays warm until the server process restarts.',
	 'Automatic revalidation of data every 30 seconds.',
	 'A hook that stores values between client re-renders.'],
	'`cache(fn)` memoizes for the lifetime of a server render (a request), so multiple components can call getUser() without duplicate fetches. It is not a cross-request data cache. It works only in Server Components.',
	`const getUser = cache(async (id: string) => db.user.find(id));
// Header and Profile can both call getUser(id): one query`);

add('advanced', 'cache-signal', 'What is `cacheSignal` (React 19.2) used for?',
	'A signal in Server Components that fires when the cache() lifetime ends, so you can cancel work.',
	['Invalidating the client-side cache automatically whenever the props of any component change at runtime.',
	 'Signaling the browser to store a response in the HTTP cache.',
	 'Subscribing to external store updates in Client Components.'],
	'`cacheSignal()` returns a signal that aborts when the render finishes, is aborted or fails. Passing it as `signal` to fetch cancels in-flight cached requests no longer needed. It is only for Server Components and works with cache().',
	`const dedupedFetch = cache(fetch);
async function Page() {
  const res = await dedupedFetch(url, { signal: cacheSignal() });
}`);

add('advanced', 'rsc', 'How can a Server Component pass async data to a Client Component without blocking the server render?',
	'Pass the un-awaited promise as a prop and read it in the client with use() inside Suspense.',
	['Await it on the server and pass the result, which is the only supported way to cross the boundary.',
	 'Pass the promise via context, since props cannot hold promises.',
	 'Call fetch in a useEffect to avoid serializing it.'],
	'Promises are serializable across the boundary. The server can start the request, stream the shell, and the client component suspends on use(promise) until it resolves. The result must itself be serializable.',
	`// server
const p = getComments(id);
return <Suspense fallback="..."><Comments p={p} /></Suspense>;
// client
const comments = use(p);`);

add('advanced', 'compiler', 'Why can React Compiler memoize code that `useMemo` cannot?',
	'It memoizes at finer grain, including code after early returns or conditionals.',
	['Because it runs memoized code on a separate thread, so it never blocks rendering.',
	 'Because it caches across page reloads.',
	 'Because it disables the Rules of Hooks.'],
	'Hooks cannot be called conditionally or after an early return, but the compiler performs analysis at build time and can cache intermediate values after such returns. It is not about threads or persistence.',
	`function List({ items, loading }: Props) {
  if (loading) return <Spinner />;
  const sorted = sortItems(items); // compiler can memoize this
  return <Rows rows={sorted} />;
}`);

add('advanced', 'compiler', 'What does the React team suggest for existing `useMemo`/`useCallback` calls after enabling React Compiler?',
	'Leave existing ones (they can matter as effect deps); skip adding new ones by default.',
	['Remove all of them at once, since the compiler strictly requires it to avoid double caching.',
	 'Convert them all to React.memo wrappers.',
	 'Add more of them so the compiler has hints.'],
	'The compiler can coexist with manual memoization; removing it might change behavior where memoized values are effect dependencies. For new code you can rely on the compiler. useMemo/useCallback remain useful as escape hatches.');

add('advanced', 'compiler', 'Your app is on React 18. What is needed to use React Compiler?',
	'Install the compiler plus react-compiler-runtime and set the target version to 18.',
	['Upgrade to React 19; it cannot work with earlier versions.',
	 'Nothing extra; the Babel plugin works without any configuration on any React version, including 17 and 18.',
	 'Switch to Server Components first.'],
	'The compiler targets React 19 by default but supports 17 and 18 through a runtime polyfill package and a `target` option. That makes incremental adoption possible without upgrading everything at once.');

add('advanced', 'activity', 'You hide a tab with `<Activity mode="hidden">` containing a `<video>` and a subscription Effect. What is the expected behavior?',
	'Effects are cleaned up and updates deferred, while DOM and state persist; stop a video in cleanup.',
	['Effects keep running in the background so data stays fresh, and updates continue at the same priority as visible content.',
	 'The whole subtree is unmounted, resetting state.',
	 'Nothing happens; mode only changes CSS visibility.'],
	'Hidden Activity unmounts Effects so hidden UI does not do work, while state and DOM are preserved for instant return. Side effects not tied to cleanup, like a playing video, still need to be handled in an Effect cleanup or layout effect. That is a common source of surprise.');

add('advanced', 'effects', 'Which usage of `useEffectEvent` is wrong?',
	'Adding it to the dependency array or passing it down to a child component.',
	['Calling it from inside an Effect that lists the other reactive values it reads.',
	 'Declaring it in the same component as its Effect.',
	 'Reading the latest props inside it.'],
	'Effect Events must be called only from Effects (or other Effect Events) in the same component or hook. They are intentionally unstable and not meant to be dependencies. The eslint plugin enforces these. They should also be used only for event-like logic, not to silence dependency warnings.');

add('advanced', 'effects', 'A chat effect reconnects whenever `theme` changes because a toast callback uses `theme`. What is the right 19.2 fix?',
	'Move the toast call into an Effect Event so theme is read without being a dependency.',
	['Remove theme from the dependency array and silence the exhaustive-deps lint rule on that line.',
	 'Store theme in a ref and update it in render.',
	 'Wrap the connection in useMemo to avoid re-creating it.'],
	'The reconnect on theme is a spurious re-sync; the theme is not part of the connection. An Effect Event separates the event logic from the reactive sync logic. Suppressing lint creates stale closures, and writing refs in render violates purity.',
	`const onMessage = useEffectEvent((m: Msg) => toast(m, theme));
useEffect(() => {
  const c = connect(roomId);
  c.on('message', onMessage);
  return () => c.disconnect();
}, [roomId]);`);

add('advanced', 'suspense', 'During SSR hydration, a user clicks inside a Suspense boundary that has not hydrated yet. What does React do?',
	'It prioritizes hydrating that boundary and replays the click once it is ready.',
	['It ignores the click until all of the page hydrates.',
	 'It discards the server HTML and renders the boundary on the client, then handles the click.',
	 'It throws a hydration error.'],
	'Selective hydration lets React hydrate boundaries independently and in priority order of user interaction. Events on not-yet-hydrated content are captured and replayed once ready. Code splitting and streaming make this valuable.');

add('advanced', 'suspense', 'A component inside a Suspense boundary throws during server rendering while streaming. What happens in React 19?',
	'That boundary falls back to client rendering, reporting the error via onError.',
	['The whole response fails with a 500, always, because streaming cannot recover from errors.',
	 'The error is swallowed and the boundary stays at its fallback forever.',
	 'The server retries three times and then renders null.'],
	'If an error occurs inside a Suspense boundary after the shell is sent, React emits instructions to client-render that boundary, where an error boundary can handle it. Errors in the shell itself fail the response unless handled. onError on the server APIs is for logging.');

add('advanced', 'errors', 'Which root option would you use to report errors that React recovered from automatically, such as a hydration mismatch that fell back to client rendering?',
	'onRecoverableError',
	['onCaughtError',
	 'onUncaughtError',
	 'onHydrationMismatch'],
	'onRecoverableError is called when React recovers without a user-visible failure. onCaughtError is for errors that an error boundary caught, and onUncaughtError for ones no boundary handled. There is no onHydrationMismatch option.');

add('advanced', 'perf', 'A context provider passes `value={{ user, setUser }}` and re-renders often. What is the problem?',
	'A new object each render makes all consumers re-render even if user is unchanged.',
	['Context cannot hold functions, because function values are not comparable between renders.',
	 'Context values must be primitives.',
	 'Consumers re-render only when setUser changes.'],
	'Context consumers re-render when the value reference changes (Object.is). Memoize the value with useMemo (or split state and dispatch into separate contexts) so unrelated parent renders do not cascade. The compiler can also stabilize it.',
	`const value = useMemo(() => ({ user, setUser }), [user]);
return <UserContext value={value}>{children}</UserContext>;`);

add('advanced', 'perf', 'What is the benefit of resetting a component\'s state by changing its `key` (e.g. `<Profile key={userId} />`)?',
	'React remounts it, discarding state without needing effects that sync props to state.',
	['It preserves state across different userId values, so the same instance keeps updating props.',
	 'It skips rendering when userId is unchanged.',
	 'It makes the component immune to Strict Mode double renders.'],
	'A new key means a new identity, so React creates a fresh instance with initial state. It avoids useEffect-based resets that cause an extra render with stale state. It is useful for forms or editors bound to an entity.');

add('advanced', 'transitions', 'Why can `useDeferredValue` be better than debouncing for filtering a large list as you type?',
	'No fixed delay, adapts to device speed, and its background render is interruptible.',
	['It prevents the input from ever re-rendering, so typing never competes with the list.',
	 'It reduces the number of network requests.',
	 'It skips the render of the list entirely.'],
	'A debounce adds latency even on fast devices and the work still blocks once it runs. A deferred value renders the stale list immediately, then re-renders in the background and can abandon it if you type again. It does not reduce network calls, and the child must be memoized to benefit.');

add('advanced', 'transitions', 'You use `useDeferredValue(query)` but typing is still janky. The list component is not wrapped in memo. Why?',
	'The child still re-renders on every keystroke; memo lets it skip the urgent render.',
	['useDeferredValue only works with useReducer state, so useState values are not deferred at all.',
	 'The deferred value must be passed to useEffect to work.',
	 'It only works in Server Components.'],
	'During the urgent render, the parent re-renders and, without memo, so does the slow child (receiving the old deferred value). Wrapping the child in memo lets React skip it in the urgent render so only the background render pays the cost.');

add('advanced', 'ssr', 'What does React 19.2\'s partial pre-rendering flow with `prerender` and `resume` enable?',
	'Pre-rendering a static shell ahead of time, then resuming dynamic parts per request.',
	['Hydrating only half of the page on the client and leaving the other half as static HTML.',
	 'Running Server Components in the browser.',
	 'Skipping Suspense boundaries during SSR.'],
	'`prerender` can return a `postponed` state along with the `prelude` HTML. Later `resume` (or `resumeToPipeableStream`) continues rendering from that state to fill in dynamic content. This is the platform feature that frameworks use for partial prerendering.');

add('advanced', 'ssr', 'What changed about `useId` output in React 19.2?',
	'The prefix became _r_, valid in CSS selectors and view-transition-name.',
	['It now returns a numeric id that increments on each call within a render.',
	 'It now returns a UUID.',
	 'It now returns unique ids that differ between server and client.'],
	'The older prefixes (`:r:` then `«r»`) were invalid for CSS identifiers and XML names. 19.2 switched to `_r_` to support View Transitions. Ids remain stable between server and client, so do not parse their format.');

add('advanced', 'ssr', 'What does batching of Suspense boundary reveals in React 19.2 streaming SSR improve?',
	'It groups reveals briefly to reduce pop-in, but stops near the 2.5s LCP threshold.',
	['It forces all boundaries to reveal at the same time, no matter how late some of them are.',
	 'It reduces HTML size by dropping fallbacks.',
	 'It disables streaming when JavaScript is blocked.'],
	'Previously each boundary streamed in as soon as it was ready. 19.2 batches reveals for a short window to reduce layout jumps, and bails out when load time approaches the LCP good threshold so important content is not delayed.');

add('advanced', 'devtools', 'What do the React Performance Tracks in Chrome DevTools (React 19.2) show?',
	'A Scheduler track by priority and a Components track for renders and effects.',
	['A flame graph of network requests grouped by component, including each fetch\'s priority.',
	 'Heap allocations per component instance.',
	 'Only Server Component timings from the build.'],
	'The tracks add React-specific lanes to Chrome performance profiles: what priority work ran, when updates were blocked, and which components were mounted, rendered or running effects. That helps explain jank without leaving DevTools.');

add('advanced', 'testing', 'Why is it a bad idea to put side effects or multiple assertions in a `waitFor` callback?',
	'It re-runs the callback repeatedly, so side effects repeat and failures get confusing.',
	['waitFor runs the callback only once, so any failure inside it is hidden from the output.',
	 'waitFor cannot contain assertions.',
	 'The callback runs before the component renders.'],
	'waitFor polls until the callback stops throwing. A click or other side effect inside would fire on each retry, and several assertions make the reported failure ambiguous. Perform actions outside, and use findBy or a single assertion in waitFor.');

add('advanced', 'testing', 'Testing a component that reads `use(promise)` inside Suspense, which approach is best?',
	'Render in <Suspense>, await findBy, and resolve the promise inside act.',
	['Render without Suspense and use getBy right away to read the resolved text.',
	 'Mock use() to return the value synchronously.',
	 'Call the component as a plain function and inspect the result.'],
	'The component suspends, so without a boundary rendering fails. Resolving the promise inside act and awaiting findBy exercises the real Suspense flow. Mocking use() tests nothing meaningful, and calling components directly breaks hooks.',
	`const promise = Promise.resolve('Hello');
render(<Suspense fallback="loading"><Message p={promise} /></Suspense>);
expect(await screen.findByText('Hello')).toBeInTheDocument();`);

add('advanced', 'patterns', 'You design a reusable `<Toggle>` that works both controlled and uncontrolled. What is the robust approach?',
	'value/defaultValue: derive from value if defined, otherwise use internal state; always call onChange.',
	['Always keep internal state and ignore the value prop after the first render, calling onChange only when the user makes an edit.',
	 'Sync props to internal state with an effect on every change.',
	 'Require consumers to pass value always.'],
	'Mirror native inputs: if `value !== undefined` it is controlled and the parent owns state; otherwise the component holds state initialized from defaultValue. Always fire onChange so the parent can react. Syncing via effects causes extra renders and stale states.',
	`function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : inner;
  const set = (v: T) => { if (!isControlled) setInner(v); onChange?.(v); };
  return [current, set] as const;
}`);

add('advanced', 'optimistic', 'Using `useOptimistic` with a reducer-like updater for a todo list, what must the updater be?',
	'A pure function (current, optimisticValue) => next that does not mutate current.',
	['An async function that awaits the server response before returning the next list value.',
	 'A function that mutates the array with push to be fast.',
	 'A function that returns undefined to signal pending.'],
	'The updater runs during render to compute what to display from the real state plus pending optimistic actions, so it must be pure. Mutating the state would corrupt the real value. The server request itself lives in the action.',
	`const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (cur: Todo[], text: string) => [...cur, { id: crypto.randomUUID(), text, pending: true }]
);`);

add('advanced', 'actions', 'Why does a `<form action={serverFunction}>` still work before the page\'s JavaScript has loaded?',
	'Server Function actions can render a form that posts natively, so it works pre-hydration.',
	['React inlines the full client bundle in the form tag itself so that submission runs immediately.',
	 'Browsers execute server functions natively.',
	 'It does not work without JavaScript; this is a limitation.'],
	'When the action is a Server Function in an SSR framework, the form is rendered with a special action reference so the browser can post it natively, and the server responds with the result. After hydration the same form uses client-side handling. Plain client functions need JS.');

add('advanced', 'actions', 'What does `requestFormReset(form)` do in React 19?',
	'It schedules a reset of uncontrolled form fields when the current transition ends.',
	['It immediately clears all state in the form component, including controlled inputs and refs.',
	 'It reloads the page to clear the form.',
	 'It resets controlled inputs to their initial state values.'],
	'Since React resets uncontrolled forms after function actions automatically, requestFormReset lets you trigger the same behavior manually when you call actions yourself (for example from an onClick), tying the reset to the transition. It does not touch controlled state.');

add('advanced', 'rsc', 'What is the right place to keep a secret API key used for server-only data fetching in an RSC app?',
	'In a Server Component or Server Function, never in Client Component code.',
	['In a Client Component, because bundled and minified code is effectively obfuscated.',
	 'In a \'use client\' module guarded by a typeof window check.',
	 'In props passed down to Client Components to use at runtime.'],
	'Anything reachable from a \'use client\' module or sent as props ends up in the browser. Server-only modules should stay outside client imports (the server-only package helps enforce it). A typeof guard does not remove code from the bundle.');

add('advanced', 'hydration', 'A browser extension injects an extra <script> tag into <body> before your app hydrates. What happens in React 19?',
	'Hydration skips unexpected head/body tags, so it proceeds without a mismatch error.',
	['Hydration fails and the entire root is discarded and re-rendered on the client.',
	 'React removes the injected tag from the DOM so the tree matches the server HTML.',
	 'The app crashes unless suppressHydrationWarning is set on the body element.'],
	'Third-party scripts and extensions commonly add tags to head or body. React 19 hydration deliberately skips unexpected elements there instead of reporting a mismatch, so the server HTML is still reused. It does not delete the foreign nodes, and real mismatches inside your own tree are still reported with a diff.');

export const reactQuestionsB = out;
