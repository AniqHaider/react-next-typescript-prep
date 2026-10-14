import { builder } from '../types';

const { out, add } = builder('R', 'react');

// ───────────────────────── Basics ─────────────────────────

add('basic', 'jsx', 'Why does this component fail to compile?',
	'A component must return a single root; sibling elements need a wrapper or a Fragment.',
	['JSX cannot contain more than one h1 element.',
	 'Function components must return a string or null.',
	 'Every JSX element must carry an explicit key prop, otherwise React refuses to compile the file.'],
	'JSX expressions compile to a single value, so adjacent elements must be wrapped in a parent element or a Fragment (`<>...</>`). There is no limit on h1 elements, components can return any renderable node, and keys are only needed for items in lists.',
	`function Page() {
  return (
    <h1>Title</h1>
    <p>Body</p>
  );
}`);

add('basic', 'jsx', 'Which attribute name is correct for applying a CSS class to a DOM element in JSX?',
	'className',
	['class', 'cssClass', 'classList'],
	'JSX is JavaScript, and `class` is a reserved word, so React uses `className` for the DOM property. `cssClass` and `classList` are not JSX attributes.');

add('basic', 'jsx', 'What does the `style` prop of a DOM element expect in React?',
	'An object with camelCased CSS properties, such as { backgroundColor: "red" }.',
	['A CSS string such as "background-color: red".',
	 'An object with kebab-case keys such as { "background-color": "red" }.',
	 'A reference to a .css file.'],
	'React maps style objects onto the element style, using camelCase property names (backgroundColor, fontSize). Passing a string throws an error in React, and kebab-case keys are not recognized as normal React style properties. Stylesheets are imported separately.');

add('basic', 'props', 'What is the correct way for a parent to pass a number to a child as a prop?',
	'<Counter start={5} />',
	['<Counter start="5" /> and React converts it to a number.',
	 '<Counter start=5 />',
	 '<Counter start:5 />'],
	'Curly braces embed a JavaScript expression, so `start={5}` passes the number 5. Quoted attributes are always strings, `start=5` is a syntax error, and the colon form is not JSX syntax.');

add('basic', 'props', 'Can a child component assign a new value to a prop it received?',
	'No. Props are read-only; the parent owns them and a child should treat them as immutable.',
	['Yes, and React re-renders the parent with the new value.',
	 'Yes, but only inside useEffect, because effects are the sanctioned place for mutations in React.',
	 'Yes, as long as the prop is an object.'],
	'Props flow one way, parent to child, and a component must never mutate its own props. Mutating an object prop also mutates the parent data without triggering a render and breaks purity. To change values, the parent passes a callback or the child keeps its own state.');

add('basic', 'children', 'What does the special `children` prop contain?',
	'Whatever JSX is nested between the opening and closing tags of the component.',
	['The list of components that render inside the parent.',
	 'The child components defined in the same file.',
	 'An array of the props of nested components.'],
	'When you write `<Card>content</Card>`, the nested content is passed to Card as `props.children`. It is simply a prop holding renderable content, not a registry of components or their props.',
	`function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}`);

add('basic', 'state', 'Why use useState instead of a normal local variable to hold a counter?',
	'Updating state triggers a re-render and the value is preserved between renders; a local variable is reset on every render.',
	['useState makes the variable global so every component in the app can read and update it, which is why it is preferred over plain locals.',
	 'Local variables cannot be numbers inside components.',
	 'useState updates the value faster than assigning a variable.'],
	'A component function re-runs on every render, so plain locals are recreated and changing them does not tell React to re-render. State lives in React between renders and a setter schedules a new render. It is scoped to the component instance, not global.');

add('basic', 'state', 'What does this code display after one click on the button?',
	'1',
	['3', '0', 'It throws because setCount is called multiple times.'],
	'The question is subtle: all three calls use the same snapshot value count = 0, so each one queues "set to 1". After the batched re-render the UI shows 1, not 3. Use the functional form `setCount(c => c + 1)` to chain updates.',
	`function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => {
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
    }}>
      {count}
    </button>
  );
}`);

add('basic', 'state', 'Why does this update fail to re-render the list?',
	'The array is mutated in place, so React sees the same reference and may skip the update.',
	['Calling push is not allowed inside event handlers because React freezes arrays that are created in render.',
	 'useState can only store primitive values.',
	 'setItems must be called inside useEffect.'],
	'React compares state with Object.is, so mutating the existing array and passing it back is the same reference. Create a new array instead, for example `setItems([...items, x])`. State can hold arrays and objects, and setters are normally called from handlers.',
	`const [items, setItems] = useState<string[]>([]);
function add(x: string) {
  items.push(x);
  setItems(items);
}`);

add('basic', 'lists', 'What is the purpose of the `key` prop when rendering a list with map?',
	'It lets React identify which item is which between renders so it can match, reorder, and preserve state correctly.',
	['It is passed to the component as a prop named key.',
	 'It sorts the items alphabetically.',
	 'It makes the list render faster by telling React to automatically skip every item whose data has not changed since the last render.'],
	'Keys give list items a stable identity. React uses them to decide which elements were added, removed, or moved, and to keep component state attached to the right item. `key` is not forwarded as a prop, does not sort anything, and is not a memoization hint.');

add('basic', 'lists', 'Which is the best choice for the key of items loaded from a database?',
	'The unique ID from the database record.',
	['The array index.',
	 'Math.random() generated on every render.',
	 'The item name, even if names can repeat.'],
	'Stable unique IDs let React track items across reorders and inserts. Index keys break identity when the list changes order, random keys force every item to remount on every render, and non-unique names cause duplicate-key problems.');

add('basic', 'conditional', 'What does this component render when `count` is 0?',
	'0, because && returns 0 and React renders numbers.',
	['Nothing, because 0 is falsy.',
	 'The string "false".',
	 'It throws an error because 0 is not a React element.'],
	'`0 && <X />` evaluates to 0, and React renders numbers, so a stray 0 appears on screen. Only false, null, undefined, and true render nothing. Use `count > 0 && ...` or a ternary to avoid this trap.',
	`function Badge({ count }: { count: number }) {
  return <div>{count && <span>New messages</span>}</div>;
}`);

add('basic', 'conditional', 'Which values render nothing at all when returned in JSX?',
	'null, undefined, true, and false',
	['null, undefined, 0, and an empty string',
	 'Only null',
	 'false and 0 only'],
	'React skips booleans, null, and undefined when rendering. An empty string renders an empty text node (nothing visible) but 0 does render as the digit. That is why `{count && ...}` with a number is a common bug.');

add('basic', 'events', 'Which handler is correct to run `handleClick` only when the button is clicked?',
	'<button onClick={handleClick}>',
	['<button onClick={handleClick()}>',
	 '<button onclick={handleClick}>',
	 '<button onClick="handleClick()">'],
	'Pass the function itself. `handleClick()` would call it during render and pass its return value. React event props are camelCase (`onClick`), and string handlers as in HTML are not supported.');

add('basic', 'events', 'What does `e.preventDefault()` do in a form submit handler?',
	'It stops the browser from performing its default action, which is a full-page form submission.',
	['It stops React from re-rendering the form.',
	 'It stops the event from bubbling up to parent elements.',
	 'It cancels any state update that was queued earlier in the same handler so the component does not re-render at all.'],
	'preventDefault cancels the browser default (navigation or reload on submit). Stopping propagation up the tree is the separate `stopPropagation`, and neither one has any effect on React state updates.',
	`function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  save();
}`);

add('basic', 'forms', 'What makes an input a controlled component?',
	'Its value is driven by React state through the value prop and updated via onChange.',
	['It has a ref attached to it.',
	 'It is wrapped in a form element, which makes React take over the input value automatically.',
	 'It uses defaultValue to set its initial text.'],
	'In a controlled input React state is the single source of truth: `value={text}` plus `onChange` writing back to state. A ref or form wrapper does not make it controlled, and `defaultValue` is the uncontrolled way of setting an initial value.',
	`const [text, setText] = useState('');
<input value={text} onChange={e => setText(e.target.value)} />`);

add('basic', 'forms', 'What happens if you give an input a `value` prop but no `onChange` handler?',
	'The input becomes read-only and React warns, unless you set readOnly.',
	['The input works normally and stores what the user types.',
	 'React automatically adds an onChange for you.',
	 'The value prop is ignored.'],
	'With a fixed `value`, React forces the DOM to show that value, so typing has no effect. React warns about it and expects either `onChange` or `readOnly`. Use `defaultValue` if you want an editable uncontrolled input.');

add('basic', 'refs', 'What is the main use of useRef with a DOM element?',
	'To get a handle to the DOM node, for example to call focus().',
	['To store a state value that re-renders on change.',
	 'To subscribe to events on the element.',
	 'To make the element render faster.'],
	'A ref attached with `ref={inputRef}` gets `.current` set to the DOM node after commit, letting you call imperative methods like focus or measure it. Changing `ref.current` does not trigger a re-render, so it is not a state replacement.',
	`const inputRef = useRef<HTMLInputElement>(null);
<button onClick={() => inputRef.current?.focus()}>Focus</button>
<input ref={inputRef} />`);

add('basic', 'refs', 'What happens when you assign a new value to `ref.current`?',
	'Nothing is re-rendered; the value is simply stored and survives across renders.',
	['The component re-renders immediately.',
	 'React throws because refs are frozen.',
	 'The value is reset to null on the next render.'],
	'Refs are an escape hatch for mutable values that do not take part in rendering. Writing to `.current` is a plain assignment: no render is scheduled and the value persists for the lifetime of the component.');

add('basic', 'effects', 'When does this effect run?',
	'After the first render and again only when `userId` changes.',
	['On every render of the component.',
	 'Only once, even if userId changes later.',
	 'Before the component renders for the first time.'],
	'The dependency array lists the reactive values the effect uses. React re-runs the effect after a commit when any of them has changed (compared with Object.is). An empty array would mean once on mount, and no array would mean every render.',
	`useEffect(() => {
  loadUser(userId);
}, [userId]);`);

add('basic', 'effects', 'What is the purpose of the function returned from useEffect?',
	'Cleanup: it runs before the effect re-runs and when the component unmounts, to undo what the effect set up.',
	['It runs once right after the effect finishes in order to report to React that the setup completed successfully and without any problems.',
	 'It provides the value that the component renders.',
	 'It runs only the first time the component mounts.'],
	'Subscriptions, timers, and listeners set up in an effect should be torn down in the cleanup function. React calls it with the old values before running the effect again and on unmount, preventing leaks and stale handlers.',
	`useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);`);

add('basic', 'hooks', 'Which call violates the Rules of Hooks?',
	'Calling useState inside an if statement.',
	['Calling useState at the top level of a function component.',
	 'Calling useState inside a custom hook named useCounter.',
	 'Calling two useState hooks one after another at the top level.'],
	'Hooks must run in the same order on every render, so they cannot be called inside conditions, loops, or nested functions. Top level of function components and custom hooks is exactly where they belong, and multiple hooks in sequence are fine.',
	`function Profile({ show }: { show: boolean }) {
  if (show) {
    const [name, setName] = useState('');
  }
  return null;
}`);

add('basic', 'hooks', 'What naming convention identifies a custom hook?',
	'The function name starts with "use" and it may call other hooks.',
	['It must be exported as default.',
	 'It must return an array of two items.',
	 'It must be declared inside the component that uses it.'],
	'The `use` prefix lets React and the lint rules know it follows the Rules of Hooks. A custom hook can return anything (value, object, tuple, nothing), live in any module, and be shared between components.');

add('basic', 'context', 'What does `useContext(ThemeContext)` return?',
	'The value from the closest ThemeContext.Provider above, or the default value if there is none.',
	['A pair containing the current theme and a function that updates it for every consumer in the tree.',
	 'The value of the farthest Provider at the top of the tree.',
	 'A promise that resolves when the theme is ready.'],
	'Context lookups find the nearest matching provider above the component in the tree. With no provider you get the default passed to createContext. Updating requires putting a setter in the context value yourself.');

add('basic', 'reducer', 'What is a reducer function used with useReducer?',
	'A pure function (state, action) => newState that computes the next state.',
	['An async function that fetches data and sets state.',
	 'A function that mutates the state object in place and then asks React to re-render the component.',
	 'A component that renders the state.'],
	'The reducer takes the current state and an action and returns the next state without side effects or mutation. `dispatch(action)` sends the action to it. This keeps update logic centralized and testable.');

add('basic', 'rendering', 'When does a React component re-render by default?',
	'When its state changes, or when its parent re-renders.',
	['Only when its props change by value.',
	 'Only when the browser window is resized.',
	 'Every time the user moves the mouse.'],
	'A state change schedules a render of that component, and by default React then re-renders its children too, regardless of whether their props changed. React.memo can opt a child out when its props are shallow-equal.');

add('basic', 'rendering', 'What are the three phases React goes through to update the screen?',
	'Trigger, render, and commit.',
	['Mount, update, and unmount, in that order, always.',
	 'Parse, compile, and execute.',
	 'Diff, patch, and paint.'],
	'A render is triggered by initial mount or a state update; React then calls your components to compute the new UI (render); finally it applies the minimal DOM changes (commit). Browser paint happens afterward and is not a React phase.');

add('basic', 'fragments', 'Why would you use a Fragment (<>...</>) instead of a div?',
	'To group elements without adding an extra node to the DOM.',
	['Fragments are faster to render than any other element.',
	 'Fragments allow you to skip the key prop in lists.',
	 'Fragments make children re-render less often.'],
	'A Fragment returns multiple siblings without a wrapper, which keeps DOM structure and CSS layouts clean (for example inside tables or flex containers). Keys are still needed on Fragment items in lists, and the short syntax cannot take a key, so use `<Fragment key>` there.');

add('basic', 'state', 'What is the right way to update one field of an object held in state?',
	'Create a new object, copying the old fields: setUser({ ...user, name: "Ana" }).',
	['Assign the field directly with user.name = "Ana", and React will detect the property change automatically.',
	 'Call setUser(user.name = "Ana").',
	 'Call setUser("name", "Ana").'],
	'State must be treated as immutable. Spreading creates a new object so React sees a changed reference. Mutating directly does not schedule a render, and the setter does not take a key/value form.');

add('basic', 'state', 'Where should two sibling components keep state that both need to read?',
	'In their closest common parent, passing it down as props (lifting state up).',
	['In a module-level global variable outside React, which both siblings import and update directly.',
	 'Duplicated in each sibling and kept in sync with effects.',
	 'In a ref inside one of the siblings.'],
	'Lifting state to the nearest shared ancestor keeps a single source of truth. Duplicating state invites sync bugs, globals do not trigger renders, and a ref in one sibling is not visible to or reactive for the other.');

add('basic', 'jsx', 'In JSX, how do you render the value of a JavaScript variable `name` inside text?',
	'<p>Hello, {name}</p>',
	['<p>Hello, ${name}</p>',
	 '<p>Hello, {{name}}</p>',
	 '<p>Hello, <name /></p>'],
	'Curly braces evaluate any JavaScript expression inside JSX. `${name}` is template literal syntax and would render literally in JSX text. Double braces are not a JSX construct (though `style={{ }}` is an object inside single braces), and `<name />` would be an element.');

// ───────────────────────── Mid ─────────────────────────

add('mid', 'state', 'What does `console.log` print right after calling `setCount(count + 1)` in the same handler, when count is 0?',
	'0, because state is a snapshot for that render and the new value only appears on the next render.',
	['1, because setCount applies the new value to the state variable synchronously before the next line runs.',
	 'undefined, because the state is cleared until the next render.',
	 'A Promise that resolves to 1.'],
	'Each render has its own fixed state values. Calling the setter queues an update; the variable `count` in the running closure never changes. You get the new value in the next render, or compute it yourself via a local variable.',
	`function handle() {
  setCount(count + 1);
  console.log(count);
}`);

add('mid', 'state', 'Given count starts at 0, what is the count after one click?',
	'3',
	['1', '2', '0'],
	'The functional form receives the latest queued state, so the three updates chain: 0 to 1 to 2 to 3, all batched into one re-render. Using `count + 1` three times would give 1 because each reads the same snapshot.',
	`<button onClick={() => {
  setCount(c => c + 1);
  setCount(c => c + 1);
  setCount(c => c + 1);
}}>+3</button>`);

add('mid', 'state', 'What is the final count after one click here?',
	'6',
	['5', '1', '0'],
	'First `setCount(count + 5)` queues "replace with 5" (count is 0 in this snapshot). Then the updater `n => n + 1` runs on that queued result, giving 6. React processes the queue in order: replacements and updater functions are applied sequentially.',
	`<button onClick={() => {
  setCount(count + 5);
  setCount(n => n + 1);
}}>go</button>`);

add('mid', 'state', 'Since React 18, how are multiple setState calls handled inside a setTimeout or a fetch callback?',
	'They are batched into a single re-render, just like in event handlers.',
	['Each call triggers a separate synchronous re-render.',
	 'They are batched only if the callback is explicitly wrapped in flushSync by the developer.',
	 'They are batched only in event handlers, never in async callbacks.'],
	'Automatic batching (React 18 with createRoot) groups updates from timeouts, promises, and native handlers into one render. Before 18 batching applied only inside React event handlers. flushSync does the opposite: it forces a synchronous flush.');

add('mid', 'state', 'Which is the best way to compute `fullName` from `firstName` and `lastName` state?',
	'Calculate it during render: const fullName = firstName + " " + lastName;',
	['Store it in a third state and update it with useEffect when either changes.',
	 'Store it in a ref and update the ref on every change.',
	 'Store it in state and update all three in each change handler to keep them in sync.'],
	'Values that can be derived from props or state should not be stored in state. Computing during render is always up to date and avoids extra render passes and desync bugs. An effect that sets derived state causes an extra render with a stale frame in between.');

add('mid', 'state', 'What happens to the state of a component when you change its `key` prop?',
	'React unmounts the old instance and mounts a new one, resetting its state.',
	['The state is preserved because the component type is the same.',
	 'Only the state variables that were derived from the key value are reset; the remaining state is kept.',
	 'React throws a warning and ignores the new key.'],
	'`key` is part of a component identity. Changing it makes React treat it as a different component, so state and effects are reinitialized. This is the idiomatic way to reset a form when, for example, the selected user changes.',
	`<ProfileForm key={userId} userId={userId} />`);

add('mid', 'state', 'The same component type renders at the same position in the tree in both branches. What happens to its state when the condition flips?',
	'The state is preserved, because React sees the same type at the same position.',
	['The state is reset because the JSX expression changed and React treats every new element object as a new instance.',
	 'The state is reset because the props are different.',
	 'React always remounts when a ternary is used.'],
	'Reconciliation compares type and position. Both branches render `<Counter />` at the same slot, so the existing instance is updated, not recreated. Give the two instances different keys, or render them at different positions, to separate their state.',
	`{isFancy ? <Counter isFancy /> : <Counter />}`);

add('mid', 'state', 'What is the problem with defining a component function inside another component body?',
	'Its identity changes every parent render, so React remounts it each time and loses its state.',
	['Nested components cannot receive props, because they close over the parent scope instead of using arguments.',
	 'It is a syntax error in modern JavaScript.',
	 'It causes the parent to render twice.'],
	'A new function means a new component type on each render, so reconciliation sees a different type and tears down the subtree, resetting state and DOM. Define components at module level and pass data as props.',
	`function Parent() {
  function Child() { const [n, setN] = useState(0); return <button onClick={() => setN(n + 1)}>{n}</button>; }
  return <Child />;
}`);

add('mid', 'state', 'What is the problem with initializing state from a prop like this?',
	'The state only uses the prop on mount; later prop changes do not update it.',
	['It causes an infinite render loop, because the prop change triggers the initializer which sets state again.',
	 'Props cannot be passed to useState.',
	 'It makes the prop writable in the parent.'],
	'`useState(initial)` ignores its argument after the first render. If the parent later passes a new `color`, state keeps the old value. Either derive from the prop during render, or reset the child with a key when the prop identity changes.',
	`function Swatch({ color }: { color: string }) {
  const [current, setCurrent] = useState(color);
  return <div style={{ background: current }} />;
}`);

add('mid', 'state', 'Which useState call avoids re-running an expensive computation on every render?',
	'useState(() => computeInitial())',
	['useState(computeInitial())',
	 'useState(computeInitial)()',
	 'useState(await computeInitial())'],
	'Passing a function is a lazy initializer: React calls it only on the first render. `computeInitial()` is evaluated every render (the result is just ignored after mount). Awaiting is not valid in a component body.');

add('mid', 'lists', 'Why are index keys a problem in a list where items can be reordered or removed?',
	'Component state and DOM can stay attached to the wrong item because identity follows position.',
	['Index keys are rejected by React at runtime and throw an error as soon as the list contains more than one item.',
	 'The list will not render items after the first.',
	 'The browser cannot reuse DOM nodes with numeric keys.'],
	'With index keys, removing the first item makes the second item take key 0 and inherit the first item state (like input text). It is acceptable only for static lists that are never reordered or filtered.');

add('mid', 'lists', 'Where must the `key` be placed when mapping to a custom component?',
	'On the outermost element returned by map, i.e. on the component usage itself.',
	['On the root DOM element inside the component definition.',
	 'On the parent array or the surrounding element that holds the list rather than on each item.',
	 'On every attribute inside the item.'],
	'Keys only have meaning in the array context where React compares siblings, which is the element returned from map. Putting the key inside the child component definition does nothing for the list.',
	`{todos.map(t => <TodoItem key={t.id} todo={t} />)}`);

add('mid', 'lists', 'How do you give a key to each pair of elements when mapping an array to two sibling elements?',
	'Return a keyed Fragment: <Fragment key={id}>...</Fragment>',
	['Use the short syntax: <key={id}>...</>',
	 'Add key only to the first element in the pair.',
	 'Wrap the pair in an array without a key.'],
	'The shorthand `<>` cannot accept props, so you must import Fragment and write `<Fragment key={id}>`. Keys belong to the top-level element returned by the map callback.',
	`{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.desc}</dd>
  </Fragment>
))}`);

add('mid', 'forms', 'Which is a valid use of an uncontrolled input?',
	'Using a ref (or FormData) to read the value on submit, with defaultValue for the initial text.',
	['Passing value and onChange but never updating the state.',
	 'Calling setState on every key stroke and additionally reading the same value back through a ref on submit.',
	 'Passing both value and defaultValue to the same input.'],
	'In an uncontrolled input the DOM holds the value and you read it when needed (ref or FormData). Providing both `value` and `defaultValue` is an error, and a non-updating controlled input is read-only.',
	`<input ref={ref} defaultValue="hello" />`);

add('mid', 'forms', 'Why does React warn about an input switching from uncontrolled to controlled?',
	'The value was undefined at first and later became a defined value, so React changed the way it manages the input.',
	['Inputs cannot use state inside effects.',
	 'You used onChange and value on the same element, which React only allows when defaultValue is also provided to the input.',
	 'The input was inside a form tag.'],
	'`value={undefined}` is treated as uncontrolled, then `value="x"` makes it controlled. Initialize state with a defined value such as an empty string to keep the input consistently controlled.',
	`const [name, setName] = useState<string>();
<input value={name} onChange={e => setName(e.target.value)} />`);

add('mid', 'forms', 'How do you bind a checkbox to boolean state?',
	'checked={isOn} and onChange reading e.target.checked',
	['value={isOn} and onChange reading e.target.value',
	 'selected={isOn} and onClick toggling the state',
	 'defaultChecked={isOn} and expecting live updates'],
	'Checkboxes and radios use the `checked` prop and `e.target.checked`, not `value`. `selected` is for option elements, and `defaultChecked` only sets the initial uncontrolled state.',
	`<input type="checkbox" checked={isOn} onChange={e => setIsOn(e.target.checked)} />`);

add('mid', 'events', 'In which order do the handlers run when a button inside a div is clicked, and both have onClick?',
	'The button handler first, then the div handler, because events bubble up.',
	['The div handler first, then the button handler, because parent handlers always run before their children.',
	 'Only the button handler runs.',
	 'They run in parallel, in an undefined order.'],
	'React events bubble from the target up through its ancestors in the React tree. Call `e.stopPropagation()` in the button handler to prevent the div handler from running. Capture-phase handlers (`onClickCapture`) run in the opposite direction, before bubbling.',
	`<div onClick={() => console.log('div')}>
  <button onClick={() => console.log('button')}>Go</button>
</div>`);

add('mid', 'events', 'What is the correct way to pass an argument to a handler when rendering a list of buttons?',
	'onClick={() => remove(item.id)}',
	['onClick={remove(item.id)}',
	 'onClick={remove, item.id}',
	 'onClick="remove(item.id)"'],
	'Wrap the call in an arrow function so it runs on click. `remove(item.id)` directly calls during render and passes its return value as the handler. The other forms are not valid ways to bind arguments.');

add('mid', 'effects', 'Why does an effect with an empty dependency array run twice on mount in development?',
	'StrictMode intentionally mounts, unmounts, and remounts to expose missing cleanup.',
	['It is a bug in the effect which runs due to a state update.',
	 'React runs every effect twice in production to be safe.',
	 'The parent re-rendered quickly after mount, so the component renders twice and the effect runs on both renders.'],
	'In development with StrictMode, React simulates unmount/remount to verify that your effect is resilient to being cleaned up and set up again. This does not happen in production. If the doubled run causes problems, your cleanup is missing or wrong.');

add('mid', 'effects', 'Which code has a race condition when `query` changes quickly?',
	'An effect that fetches and sets state with no cleanup or ignore flag.',
	['An effect that fetches and aborts the request in cleanup.',
	 'An effect with an ignore flag set to true in cleanup.',
	 'A data library that dedupes by key and returns the latest.'],
	'Responses may arrive out of order, so an older request can overwrite the newer result. Guard with an `ignore` flag or an AbortController in the cleanup so stale responses are discarded.',
	`useEffect(() => {
  fetch('/api/search?q=' + query)
    .then(r => r.json())
    .then(setResults);
}, [query]);`);

add('mid', 'effects', 'What does the cleanup in this effect do to avoid the stale response problem?',
	'It marks the previous run as ignored so its late response does not call setResults.',
	['It cancels the in-flight network request on the server so the old response never arrives at the client.',
	 'It prevents the effect from running again.',
	 'It converts the fetch into a synchronous call.'],
	'On the next `query` change or on unmount, React runs the cleanup, which sets `ignore = true` for that closure. When the old promise resolves it checks the flag and drops the result. It does not cancel the request itself (use AbortController for that).',
	`useEffect(() => {
  let ignore = false;
  fetch('/api/search?q=' + query)
    .then(r => r.json())
    .then(data => { if (!ignore) setResults(data); });
  return () => { ignore = true; };
}, [query]);`);

add('mid', 'effects', 'Which of these is a case where you do NOT need an effect?',
	'Resetting or recalculating something that can be derived from props or state during render.',
	['Subscribing to a browser event like window resize.',
	 'Synchronizing a component with a non-React widget, such as a map library or a custom video player.',
	 'Connecting to a chat server while the component is visible.'],
	'Effects are for synchronizing with external systems. Derived data, filtering lists, or responding to user events belong in render or event handlers. Subscriptions, third-party widgets, and network connections are legitimate effect use cases.');

add('mid', 'effects', 'Where should the logic for sending a POST request when the user clicks "Buy" live?',
	'In the click event handler, since it is caused by a specific user action.',
	['In a useEffect that watches a "bought" state.',
	 'In the render body of the component.',
	 'In useLayoutEffect, so that the request starts before the browser paints the next frame.'],
	'Code that runs because the user did something belongs in the event handler: it runs exactly once per action. Triggering it from an effect couples it to renders and can send duplicates (for example in StrictMode). Never perform side effects in render.');

add('mid', 'effects', 'What does the missing dependency cause in this component?',
	'The interval keeps using the stale count captured on the first render, so the display sticks at 1.',
	['An infinite render loop.',
	 'The interval is never cleared.',
	 'A runtime error stating that count is undefined, because the effect closure was created before the state existed.'],
	'With `[]`, the effect closure is created once and captures count = 0, so `setCount(count + 1)` always sets 1. Use `setCount(c => c + 1)` to remove the dependency, or list count and re-subscribe.',
	`useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);`);

add('mid', 'effects', 'Why is an object created in the component body a problem as an effect dependency?',
	'It is a new reference every render, so the effect re-runs on every render.',
	['Objects cannot be listed in a dependency array.',
	 'The effect never runs because objects are compared by value.',
	 'Nothing is wrong; React compares objects deeply, so the effect only re-runs when a field actually changes.'],
	'Dependencies are compared with Object.is, so a fresh object literal each render is always "changed". Move it outside the component, memoize it, or depend on the primitive values inside it.',
	`const options = { id: roomId };
useEffect(() => {
  connect(options);
}, [options]);`);

add('mid', 'refs', 'Why should you not read or write `ref.current` during rendering (except for lazy init)?',
	'It makes render impure and unpredictable because refs are not tracked by React.',
	['Refs are null until the second render.',
	 'It throws an error in StrictMode because refs are frozen while the component is rendering.',
	 'Refs can only hold DOM elements.'],
	'Rendering must be a pure function of props and state. Mutating or depending on a ref during render creates hidden inputs and can break concurrent rendering. Read and write refs in event handlers and effects.');

add('mid', 'refs', 'How do you pass a ref to a function component in React 19 so the parent can reach its DOM node?',
	'Accept `ref` as a regular prop and pass it down to the element.',
	['Wrap the component in forwardRef, because ref cannot be a prop.',
	 'Use a prop named innerRef only; ref is reserved.',
	 'Call createRef inside the child render.'],
	'Since React 19, function components receive `ref` as an ordinary prop, so forwardRef is no longer required for new code (it still works). Under 18 and earlier, `ref` was stripped, which is why forwardRef existed.',
	`function Input({ ref, ...props }: React.ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}`);

add('mid', 'refs', 'What is the best way to keep the latest value of a prop available to a long-lived callback without re-subscribing?',
	'Store it in a ref and update the ref in an effect or handler.',
	['Put it in state and read it from the callback.',
	 'Read the prop directly in the callback closure created once.',
	 'Disable the exhaustive-deps lint rule and keep the dependency array empty so nothing re-subscribes.'],
	'A ref gives a stable box whose `.current` can always hold the latest value without causing renders or re-subscription. Reading the prop in a once-created closure gets stale, and disabling the lint rule hides the bug rather than fixing it.');

add('mid', 'hooks', 'When does `useMemo` actually provide a benefit?',
	'When it caches a genuinely expensive calculation, or stabilizes an object passed to a memoized child or a dependency.',
	['Always, because it makes every calculation free.',
	 'It guarantees that the cached value is never recomputed, so it is a semantic guarantee you can safely rely on for program correctness.',
	 'It is required whenever you compute values from props.'],
	'useMemo skips recomputation if dependencies are unchanged, which helps for slow work or referential stability. React may discard the cache, so it is a performance hint, not a semantic guarantee. Premature memoization adds noise without gain.');

add('mid', 'hooks', 'What does `useCallback(fn, deps)` return?',
	'The same function instance between renders as long as the dependencies are unchanged.',
	['A wrapper function that always runs the original callback asynchronously, after the next render commits.',
	 'The result of calling fn.',
	 'A promise for fn.'],
	'useCallback caches the function itself (equivalent to `useMemo(() => fn, deps)`). It is useful when a stable reference matters, such as for a memoized child prop or effect dependency. It does not call or delay the function.');

add('mid', 'rendering', 'Why does wrapping a child in React.memo sometimes have no effect?',
	'A new object or function prop is created each parent render, so the shallow prop comparison always fails.',
	['memo only works on class components, so function components always re-render regardless of what props they receive.',
	 'memo skips renders only on the first mount.',
	 'The child must also use useMemo internally.'],
	'memo compares props shallowly with Object.is. Inline objects, arrays, and arrow functions have a new identity each render so the child re-renders anyway. Stabilize them with useMemo/useCallback or move them out of the component.',
	`const Row = memo(function Row({ onSelect }: { onSelect: () => void }) { /* ... */ return null; });
<Row onSelect={() => select(id)} />`);

add('mid', 'purity', 'Which of these breaks the purity rule for components?',
	'Modifying a variable declared outside the component during render.',
	['Declaring a local variable and mutating it during the same render.',
	 'Reading props and computing JSX from them.',
	 'Calling Math.max on an array prop.'],
	'A pure component returns the same output for the same inputs and does not change anything that existed before it started rendering. Local variables created during the render are fine to mutate; touching outer variables is a side effect.',
	`let guest = 0;
function Cup() {
  guest = guest + 1;
  return <h2>Guest #{guest}</h2>;
}`);

add('mid', 'rendering', 'In StrictMode (development), what extra thing does React do with function component bodies?',
	'It renders them twice to help find impure code.',
	['It renders them once but delays the commit.',
	 'It disables hooks inside them.',
	 'It runs them on a separate worker thread to measure time.'],
	'StrictMode double-invokes render functions (and state initializers/updaters) to surface side effects in render. It does not affect production output. It also re-runs effects once for a mount/unmount/mount check.');

add('mid', 'context', 'What happens to consumers of a context when the Provider value is a new object literal on each render of the provider?',
	'All consumers re-render every time the provider renders, because the value identity changed.',
	['Nothing visible happens, because context consumers compare the provided values deeply before re-rendering.',
	 'Only consumers that read changed fields re-render.',
	 'Consumers never re-render after mount.'],
	'Context compares the provided value with Object.is. An inline `{ user, setUser }` is new each time. Memoize the value or split context so unrelated consumers are not re-rendered.',
	`<UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>`);

add('mid', 'reducer', 'When is useReducer a better fit than useState?',
	'When state has several related fields with transitions that depend on one another and benefit from central logic.',
	['When you only need a boolean toggle.',
	 'When you want state updates to be applied synchronously instead of being batched by React until the end of the event.',
	 'When you want to avoid re-renders entirely.'],
	'Reducers consolidate update logic into one pure function and make complex transitions easier to reason about, test, and log. They do not avoid renders or change timing. A single boolean is simpler with useState.');

add('mid', 'hooks', 'Which statement about useId is correct?',
	'It generates a stable unique ID that matches between server and client, useful for linking labels and inputs.',
	['It should be used as the key for list items, since every id it returns is unique across all renders and components of the app.',
	 'It returns a new ID on every render.',
	 'It generates cryptographically secure tokens.'],
	'useId produces IDs that are consistent across server rendering and hydration and stable across renders, which avoids hydration mismatches from random IDs. It is not meant for list keys (keys should come from data) or for security.',
	`const id = useId();
<label htmlFor={id}>Name</label>
<input id={id} />`);

add('mid', 'portals', 'What does createPortal let you do?',
	'Render children into a different DOM node while keeping them in the same React tree for context and events.',
	['Render a component on the server only and send the finished HTML to the client, skipping any client JavaScript entirely.',
	 'Move state from one component to another.',
	 'Run a component in a separate thread.'],
	'Portals render into any DOM container (like document.body) which is useful for modals and tooltips escaping overflow or z-index. Context still flows from the React parent, and events bubble through the React tree, not the DOM tree.',
	`createPortal(<Modal />, document.body)`);

add('mid', 'jsx', 'What does `{...props}` do on an element in JSX?',
	'Spreads the object properties as individual props on the element.',
	['Passes the object as a single prop named props.',
	 'Clones the element together with all of its children and re-creates their state.',
	 'Throws, because spread is not allowed in JSX.'],
	'JSX spread attributes expand an object into props, so `<input {...{ type: "text", id: "a" }} />` is `<input type="text" id="a" />`. Later props override earlier ones, so order matters.');

add('mid', 'children', 'How do you render a component conditionally and also pass it a children default?',
	'Use `children ?? fallback` (or a default prop) inside the component.',
	['children cannot be undefined in React.',
	 'Use `children || null` in the parent only.',
	 'Defaults are only available with defaultProps on function components.'],
	'`children` is undefined if nothing is nested, so you can fall back to default content with `??` or a default parameter. defaultProps was removed for function components in React 19, so use default parameter values.',
	`function Button({ children = 'Click me' }: { children?: React.ReactNode }) {
  return <button>{children}</button>;
}`);

add('mid', 'jsx', 'Which statement about React 19 JSX transform and imports is correct?',
	'You do not need to import React to write JSX; the compiler uses the automatic runtime.',
	['You must import React in every file that contains JSX, otherwise the compiler cannot find createElement.',
	 'JSX only works in files named .jsx.',
	 'You must call React.createElement manually in TypeScript.'],
	'The automatic JSX runtime (default for years, and required in React 19) imports the jsx helper for you. Import React only if you use its named APIs. TypeScript files use .tsx for JSX.');

// ───────────────────────── Advanced ─────────────────────────

add('advanced', 'hooks', 'What is `useSyncExternalStore` designed for?',
	'Subscribing to an external store in a way that is safe with concurrent rendering and avoids tearing.',
	['Persisting component state to localStorage automatically so it survives page reloads and new browser tabs.',
	 'Synchronizing two React states in different components.',
	 'Making effects run synchronously after every render.'],
	'It takes a subscribe function and a snapshot getter so React can read a consistent store value even when rendering is interruptible, and re-render when the store changes. It is the primitive behind libraries like Redux and Zustand. It is not a persistence or effect-timing tool.',
	`const width = useSyncExternalStore(
  cb => { window.addEventListener('resize', cb); return () => window.removeEventListener('resize', cb); },
  () => window.innerWidth,
  () => 0
);`);

add('advanced', 'hooks', 'In useSyncExternalStore, what happens if getSnapshot returns a new object each call even though the store has not changed?',
	'React will loop re-rendering, because snapshots are compared with Object.is and appear to change every time.',
	['It works fine, because React compares snapshot objects by value and notices that nothing has really changed inside them.',
	 'React ignores the result after the first call.',
	 'It throws only in production.'],
	'getSnapshot must return a cached, referentially stable value when the underlying data has not changed. Otherwise React sees a different snapshot on each check and warns about the infinite loop. Cache the derived object or select primitive pieces.');

add('advanced', 'hooks', 'When should you prefer `useLayoutEffect` over `useEffect`?',
	'When you must measure or mutate the DOM before the browser paints, to prevent a visible flicker.',
	['When you want the effect to run on the server.',
	 'When you want the effect to be non-blocking and to run later, after the browser has fully finished painting everything.',
	 'When the effect fetches data.'],
	'useLayoutEffect runs synchronously after DOM changes but before paint, so measurements (like tooltip size) and layout adjustments are applied before the user sees a frame. It blocks painting, so use it sparingly. It does not run on the server, and data fetching belongs in useEffect or a data layer.',
	`useLayoutEffect(() => {
  const { height } = ref.current!.getBoundingClientRect();
  setTooltipHeight(height);
}, []);`);

add('advanced', 'effects', 'What is wrong with this effect?',
	'It sets state that it also depends on, so it re-runs after every update and loops forever.',
	['setItems cannot be called inside useEffect.',
	 'The effect has no cleanup function, so it leaks memory every time the component re-renders on screen.',
	 'The dependency array must be empty when using a setter.'],
	'The effect changes `items`, which is in its dependency list, so each run triggers another run. Use the functional update `setItems(prev => ...)` without depending on items, or restructure so the effect is not needed.',
	`useEffect(() => {
  setItems([...items, 'new']);
}, [items]);`);

add('advanced', 'effects', 'Why is an event handler passed to a subscription often moved into a "useEffectEvent"?',
	'So the effect can read the latest props or state without re-subscribing when they change.',
	['To make the handler run during render.',
	 'To make the handler an async function so that it can safely await values inside the effect body.',
	 'To memoize the handler for React.memo children.'],
	'useEffectEvent (stable in React 19.2) extracts non-reactive logic from an effect: the Effect Event always sees the latest values but is not a dependency, so the connection is not torn down when those values change. It is only for calling from inside effects, not for passing to children.',
	`const onConnected = useEffectEvent(() => showToast(theme));
useEffect(() => {
  const c = createConnection(roomId);
  c.on('connected', onConnected);
  c.connect();
  return () => c.disconnect();
}, [roomId]);`);

add('advanced', 'effects', 'What order do effects clean up and run when a dependency changes?',
	'The previous cleanup runs first, then the new effect runs.',
	['The new effect runs first, then the previous cleanup.',
	 'Only the new effect runs; cleanup happens on unmount only.',
	 'They run in parallel.'],
	'Before re-running an effect due to changed dependencies, React runs the cleanup from the previous render (with that render values), then runs the new effect. This lets you safely swap subscriptions without leaks.');

add('advanced', 'effects', 'A child effect and a parent effect both run on mount. In what order?',
	'Child effects run before parent effects.',
	['Parent effects run before child effects.',
	 'Order is random for each mount.',
	 'Only the parent effect runs on mount.'],
	'Effects (and layout effects) run bottom-up in the tree after commit, so children are set up before their parent. Render goes top-down, but effects fire child-first.');

add('advanced', 'state', 'What is the main reason to avoid mirroring props into state with an effect like `useEffect(() => setValue(prop), [prop])`?',
	'It causes an extra render with stale state, and the duplicated state can desync from the source.',
	['Effects cannot read props directly, so copying them into state is the only way to use them inside an effect body.',
	 'It makes the prop immutable.',
	 'React throws on setState inside effects.'],
	'The first render with a new prop shows the old state, then the effect updates it and triggers another render. Derive during render, or use a key to reset when identity changes. Effects can read props and call setState, but it is usually a smell here.');

add('advanced', 'state', 'What happens if you call a setState of the same component during render, unconditionally?',
	'React re-renders immediately and eventually throws "Too many re-renders" (infinite loop).',
	['The state is updated silently with no issue.',
	 'The update is deferred until after the next event handler, so the render completes with the old state.',
	 'It only logs a warning.'],
	'Setting state during render schedules another render, which sets state again. React allows a guarded set (such as storing prev props) for the same component, but an unconditional call is an infinite loop and throws.',
	`function Bad() {
  const [n, setN] = useState(0);
  setN(n + 1);
  return <p>{n}</p>;
}`);

add('advanced', 'rendering', 'Does React compare state updates with a deep comparison to decide whether to re-render?',
	'No. It uses Object.is on the new and previous state values and bails out if they are the same.',
	['Yes, it deeply compares all nested objects and arrays and re-renders only when some inner field differs.',
	 'Yes, but only for arrays.',
	 'No, it always re-renders even when the value is identical.'],
	'If you set state to a value that is Object.is-equal to the current one, React skips re-rendering children (it might still render the component once more before bailing out). That is why a mutated object does not trigger an update and a new equal-looking object does.');

add('advanced', 'rendering', 'What identifies a component instance during reconciliation?',
	'Its type and position in the tree, plus its key if provided.',
	['Its props object identity.',
	 'Its display name only.',
	 'The order in which each component instance was first created during the initial mount.'],
	'React matches old and new elements by type and position (and key among siblings). Same type at the same position means the instance and state are reused, a different type or key means a remount. Props identity and names are irrelevant.');

add('advanced', 'rendering', 'What does React do when the element type at a position changes from <div> to <section> between renders?',
	'It unmounts the old subtree and mounts a new one, destroying the state of everything inside.',
	['It updates the tag name in place on the existing DOM node and keeps all descendant state intact.',
	 'It keeps the children but recreates only the wrapper node.',
	 'It throws an invariant error.'],
	'Different element types produce different trees, so React tears down the old subtree and builds the new one. All descendant component state is lost. The same applies when swapping one component type for another at the same position.');

add('advanced', 'context', 'Which approach best reduces unnecessary re-renders from a large context holding both frequently changing and rarely changing data?',
	'Split it into separate contexts, so consumers subscribe only to the part they need.',
	['Wrap each consumer in useEffect.',
	 'Make the context value a ref and read it in render so React tracks which fields each consumer reads.',
	 'Use a single context and rely on React to diff fields.'],
	'Every consumer of a context re-renders when its value changes, and React does not track which fields were read. Splitting state and dispatch (or fast and slow data) into different contexts limits the blast radius. Reading a ref in render would not re-render at all when it changes.');

add('advanced', 'context', 'What does a component read from context if it is rendered outside any matching Provider and createContext had no default argument?',
	'undefined, so a custom hook usually throws a helpful error when it detects that.',
	['It throws automatically at the first useContext call.',
	 'An empty object, which React creates automatically so that destructuring never fails.',
	 'null, because React supplies it.'],
	'createContext(defaultValue) returns the default when there is no Provider; with no default it is undefined. React does not throw by itself, so the common pattern is a `useX()` hook that checks for undefined and throws a descriptive error.',
	`const Ctx = createContext<Value | undefined>(undefined);
function useCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCtx must be used within Provider');
  return v;
}`);

add('advanced', 'reducer', 'In a reducer, which is the bug in this "add" case?',
	'It mutates the existing array with push and returns the same reference.',
	['The reducer should be async so that it can await the new item before it is added.',
	 'It must return undefined for unknown actions.',
	 'Reducers cannot receive an action object.'],
	'Reducers must be pure and return new state without mutating the old. With push, React sees the same array reference and may skip rendering, and StrictMode double-calling will add the item twice. Return `[...state, action.item]` instead.',
	`function reducer(state: string[], action: { type: 'add'; item: string }) {
  switch (action.type) {
    case 'add':
      state.push(action.item);
      return state;
  }
}`);

add('advanced', 'hooks', 'Why does a custom hook called in two components not share state between them?',
	'Each call runs its own hooks, so every component instance gets its own independent state.',
	['Custom hooks are singletons, so every component calling the same hook reads the same shared state by default.',
	 'State is shared only if the hook uses useRef.',
	 'State is shared when both components import the same file.'],
	'A custom hook is just a function that calls built-in hooks, so each call creates separate state tied to the calling component instance. To share state, lift it up, use context, or use an external store.');

add('advanced', 'hooks', 'What is the key reason that hooks must be called in the same order on every render?',
	'React identifies each hook by its call order in the component, not by name.',
	['It is only a style rule enforced by ESLint; React itself does not depend on the call order at runtime.',
	 'Hooks are stored in a map keyed by variable name.',
	 'It lets the compiler inline them.'],
	'React keeps a list of hook slots per component fiber and matches calls to slots by index. A conditional hook shifts the later indexes and mismatches state with the wrong hook. Variable names are not available at runtime.');

add('advanced', 'rendering', 'What is the difference between rendering and committing in React?',
	'Rendering calls your components to compute the next UI; committing applies the resulting changes to the DOM.',
	['Rendering updates the DOM; committing runs effects only.',
	 'They are the same thing, with render being the name used on mount and commit the name used on later updates of the component.',
	 'Committing happens before rendering to prepare data.'],
	'A render is pure computation (your function bodies) and may be repeated or discarded; the commit is the phase where React mutates the DOM and then runs layout effects and, afterward, effects. Rendering alone never touches the DOM.');

add('advanced', 'rendering', 'What does `flushSync` do?',
	'Forces React to apply the enclosed state updates and update the DOM synchronously.',
	['Delays state updates until the browser is idle so that they never block user input or painting.',
	 'Batches all updates in the application into one.',
	 'Synchronizes state between server and client.'],
	'flushSync opts out of batching for the callback so you can read the updated DOM immediately afterward. It is an escape hatch that can hurt performance and should be used rarely, for example to scroll to a just-added item.',
	`flushSync(() => setTodos([...todos, next]));
listRef.current?.lastElementChild?.scrollIntoView();`);

add('advanced', 'refs', 'What can you do with a ref callback (`ref={node => ...}`) in React 19 that matters for cleanup?',
	'Return a cleanup function from it, which runs when the element is detached or the ref changes.',
	['Nothing, ref callbacks must return undefined.',
	 'Return a promise that resolves on unmount so that asynchronous teardown can be safely awaited by React.',
	 'Return the node to replace the DOM element.'],
	'React 19 supports cleanup functions returned from ref callbacks, similar to effects, so you can disconnect observers when the node goes away. Previously React called the callback with null on detach; with a cleanup function that null call is skipped.',
	`<div ref={node => {
  const ro = new ResizeObserver(onResize);
  ro.observe(node!);
  return () => ro.disconnect();
}} />`);

add('advanced', 'memo', 'Which change makes a React.memo child re-render even though its visible props did not change?',
	'The child consumes a context whose value changed.',
	['The parent re-rendered with identical primitive props.',
	 'A sibling component updated its state.',
	 'The grandparent re-rendered but passed the same props.'],
	'memo only blocks re-renders caused by the parent. A component re-renders when its own state changes or a context it reads changes, regardless of memo. Identical props and sibling updates are skipped by memo.');

add('advanced', 'rendering', 'What problem does keying a list by index cause with uncontrolled inputs in each row?',
	'After deleting a row, typed text stays in its DOM position and appears in the wrong item.',
	['The inputs lose focus on every keystroke because React remounts every row whenever the list renders.',
	 'React refuses to render inputs in lists.',
	 'The browser shows duplicate IDs.'],
	'Uncontrolled input text lives in the DOM node. With index keys, removing item 0 reuses the node for key 0 with data from the next item, so the typed text sticks to the position, not the item. Stable ids keep nodes attached to the right data.');

add('advanced', 'purity', 'Why is it safe to mutate a local array created during render, but unsafe to mutate one passed as a prop?',
	'The local array is created fresh in this render and nobody else has seen it; the prop belongs to someone else and may be reused.',
	['Props are frozen by React with Object.freeze in every environment, including production builds, so mutating a prop always throws.',
	 'Arrays created in render are always immutable.',
	 'There is no difference; both are equally unsafe.'],
	'Purity only forbids changing things that existed before the render began. "Local mutation" of values you created during the call is fine. Props and state are shared with other renders and components, so mutating them causes hidden bugs (React does not freeze them in production, though).',
	`function List({ items }: { items: string[] }) {
  const sorted = [...items].sort();
  return <ul>{sorted.map(i => <li key={i}>{i}</li>)}</ul>;
}`);

add('mid', 'events', 'Why can you read `e.target.value` inside a setTimeout callback in React 17+ without calling e.persist()?',
	'Event pooling was removed, so the event object stays valid after the handler returns.',
	['React silently copies every event into state before calling the handler, so the data is always kept.',
	 'Synthetic events are frozen snapshots of the DOM node taken at the moment the event was fired.',
	 'It is only safe inside useEffect, because effects run after React has finished with the event.'],
	'Older React reused (pooled) synthetic event objects and cleared them after the handler, which required e.persist(). React 17 removed pooling, so the event object remains usable asynchronously. Note that reading e.target.value later still reads the live DOM value at that time.');

add('mid', 'keys', 'Can two different lists on the same page contain items that use the same key?',
	'Yes; keys only need to be unique among siblings within the same array.',
	['No; keys must be unique across every list that is rendered anywhere in the whole application.',
	 'No; React throws as soon as two items in different components share the same key string.',
	 'Yes, but only when both lists happen to have exactly the same number of items.'],
	'Keys are scoped to the array of siblings being reconciled, so two separate lists can reuse ids like 1, 2, 3 without conflict. Duplicates inside the same array are what cause warnings and misbehaving state.');

add('mid', 'hooks', 'Does the setter returned by useState need to be listed in an effect dependency array?',
	'No; it has a stable identity, so omitting it is safe.',
	['Yes; it changes on every render, so it must always be listed to avoid stale closures.',
	 'Yes; it is recreated whenever its state changes, so leaving it out gives stale behavior.',
	 'No, but only when the setter is first wrapped in useCallback by the developer.'],
	'React guarantees setState (and useReducer dispatch) keep the same identity for the lifetime of the component, and the exhaustive-deps lint rule knows this. Listing it is harmless but unnecessary, and wrapping it in useCallback adds nothing.');

add('mid', 'forms', 'How can you read every field of a form on submit without making each input controlled?',
	'Create new FormData(e.currentTarget) and read the named fields.',
	['Read e.target.value on the submit event, which contains the value of every input in the form.',
	 'Call useState once per input and read the values back out of the setter functions on submit.',
	 'Use document.forms directly, because React does not allow access to form data in handlers.'],
	'FormData collects all named, non-disabled fields of a form element, so uncontrolled inputs need no per-field state. e.target on a submit event is the form itself and has no single value, setters do not expose state, and nothing blocks you from using standard DOM APIs.',
	`function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  save(String(data.get('email')));
}`);

add('mid', 'portals', 'A button inside a portal is clicked. Which ancestors receive the bubbling click event?',
	'Ancestors in the React tree, including the component that rendered the portal.',
	['Only ancestors in the DOM tree, which is the container the portal content was rendered into.',
	 'None, because events fired inside portals never bubble past the portal boundary at all.',
	 'Only a listener on document.body, because that is where portal content usually lives.'],
	'React synthetic events propagate through the React component tree, so a parent that renders <Portal> still sees clicks from inside it even though the DOM nodes are elsewhere. Context works the same way.');

add('advanced', 'hooks', 'Which values are guaranteed to keep the same identity across renders?',
	'The setState function from useState and the dispatch function from useReducer.',
	['Any function that is returned by a custom hook, because hooks always memoize their return values.',
	 'The [state, setState] array that useState returns, since React caches the same tuple for every render.',
	 'The value read from useContext, as long as the component that calls it does not re-render.'],
	'Only the setter and dispatch are explicitly stable. The array returned by useState is created fresh each call, custom hooks return whatever they build (not automatically memoized), and a context value changes whenever the provider supplies a new one.');

export const reactQuestionsA = out;
