import { builder } from '../types';

const { out, add } = builder('T', 'typescript');

// ───────────────────────── Basic ─────────────────────────

add('basic',
	'functions',
	'Why does this compile even though the callback returns a number?',
	'Function types with a void return accept functions returning anything; the result is ignored.',
	['TypeScript silently converts the returned number to undefined.',
	 'void is an alias of unknown, so every return value is allowed.',
	 'Arrow functions are never checked against their contextual return type, so any body is accepted.'],
	'Assignability to `() => void` is deliberately loose so that `arr.forEach(x => results.push(x))` works even though push returns a number. This leniency applies only to function TYPES: a function declaration annotated `: void` that does `return 42` is an error. void is not unknown, and nothing is converted at runtime.',
	`const cb: () => void = () => 42;      // ok

function g(): void {
  return 42;                          // error
}`);

add('basic',
	'types',
	'What is the type `string & number`?',
	'never — no value can be both a string and a number.',
	['string | number',
	 'unknown',
	 'An object type with the members of both primitives.'],
	'An intersection contains only values that satisfy every constituent. Since no value is both a string and a number, TypeScript reduces the intersection of disjoint primitives to never. A union (|) is what would give "either one"; intersections of object types merge their members, but primitives have no such merging.');

add('basic',
	'unions',
	'Given a value of type `string | number`, which method call compiles without narrowing first?',
	'value.toString(), because it exists on both string and number.',
	['value.toFixed(2), because TypeScript picks the number member.',
	 'value.toUpperCase(), because TypeScript picks the string member.',
	 'Both toFixed and toUpperCase, because unions expose every member.'],
	'On a union you can only access members present on every constituent; the rest require narrowing (typeof). Unions do not expose the combined set of members — that is what intersections do. toString exists on both, so it is the only one of these that compiles.');

add('basic',
	'objects',
	'What is the difference between `{ x?: string }` and `{ x: string | undefined }`?',
	'The first can be omitted entirely; the second must be present, even if undefined.',
	['There is no difference; both accept exactly the same set of objects in every case.',
	 'The first allows null values, the second does not.',
	 'The second makes x optional at runtime only.'],
	'With `x: string | undefined` an empty object `{}` is an error ("property x is missing"), whereas `x?: string` accepts it. Neither mentions null. The distinction matters for APIs where "missing" and "explicitly undefined" differ; exactOptionalPropertyTypes sharpens it further.',
	`const a: { x: string | undefined } = {}; // error
const b: { x?: string } = {};            // ok`);

add('basic',
	'objects',
	'What does `Object.keys(user)` return when user has the type `{ id: number; name: string }`?',
	'string[]; the keys are not narrowed.',
	['("id" | "name")[], because the keys are known statically',
	 'Array<keyof typeof user>',
	 '[string, string]'],
	'Because objects can carry extra properties at runtime (structural typing), the lib declares `Object.keys(o: object): string[]`. If you really know the shape is exact, cast: `Object.keys(user) as (keyof typeof user)[]`. The result is a plain list, never a tuple.');

add('basic',
	'collections',
	'What does `map.get("a")` return for `const map = new Map<string, number>()`?',
	'number | undefined',
	['number',
	 'number | null',
	 'number, unless strictNullChecks is on'],
	'Map#get is declared to return `V | undefined`, so you must handle the missing-key case before using the value. It uses undefined, not null. The type does not depend on a flag in a way that removes it; with strictNullChecks off, undefined is simply absorbed into every type.');

add('basic',
	'narrowing',
	'After `typeof v === "object"` on a value of type unknown, what does TypeScript narrow v to?',
	'object | null',
	['object',
	 'Record<string, unknown>',
	 '{}'],
	'The famous JavaScript quirk (`typeof null === "object"`) is modelled by the compiler, so null must still be ruled out before you read properties. Add `v !== null` to get `object`. It does not narrow to Record<string, unknown> on its own.');

add('basic',
	'inference',
	'What happens to the type of `x` after each assignment here?',
	'Tracked by control flow: number after the first assignment, string | number after the branch.',
	['It is any for its whole life because it has no annotation.',
	 'It is fixed to number by the first assignment, so the later string assignment is reported as an error.',
	 'It is unknown until it is returned from the function.'],
	'A `let` declared without a type or initializer gets an "evolving" (auto) type under noImplicitAny: each read sees the union of what could have been assigned along that path. It is not a plain any — misuse is still reported. It is not locked to the first assignment either.',
	`function f(cond: boolean) {
  let x;
  x = 1;
  x;                 // number
  if (cond) x = "a";
  x;                 // string | number
}`);

add('basic',
	'assertions',
	'Why does `const n = "5" as number` fail to compile?',
	'The types must sufficiently overlap; unrelated ones need a detour through unknown.',
	['as can only be used with object types.',
	 'Strings can be asserted to numbers only when combined with a non-null assertion operator.',
	 'The compiler rejects every use of as in strict mode.'],
	'A type assertion from S to T requires that one type be assignable to the other ("sufficient overlap"). string and number do not overlap, so the compiler warns that the conversion may be a mistake. `"5" as unknown as number` compiles but is a lie — you still hold a string at runtime.');

add('basic',
	'inference',
	'Why does passing `cfg.mode` to a function expecting `"dark" | "light"` fail here?',
	'Object literal properties are widened, so cfg.mode is string, not "dark".',
	['"dark" is not a member of the union.',
	 'Objects declared with const keep their literal property types only when frozen.',
	 'Function arguments must be declared with let to be assignable.'],
	'`const` protects the binding, not the properties: the literal "dark" widens to string inside the object because it could be reassigned. Fix it with `as const`, an explicit type annotation, or `satisfies`, which checks the shape while preserving the literal.',
	`function setMode(m: "dark" | "light") {}

const cfg = { mode: "dark" };
setMode(cfg.mode); // error: string is not assignable`);

add('basic',
	'enums',
	'Why is `const s: Status = "active"` an error when `enum Status { Active = "active" }`?',
	'Only enum members are assignable; a bare string literal with the same value is not.',
	['The string must be uppercase so it matches the member name exactly, e.g. "ACTIVE".',
	 'String enums only accept values from a const assertion.',
	 'Enums need to be imported with import type.'],
	'Unlike a union of literals, a string enum type admits only its own members (`Status.Active`), even when a literal has the identical value. That is one reason many teams prefer `"active" | "inactive"` unions, which accept plain literals and need no import.',
	`enum Status { Active = "active" }
const s: Status = "active";        // error
const t: Status = Status.Active;   // ok`);

add('basic',
	'enums',
	'With `enum E { A, B }`, what does TypeScript 5 do with `const e: E = 5`?',
	'It reports an error: 5 is not one of the enum values.',
	['It compiles, because numeric enums have always accepted any numeric value.',
	 'It compiles but emits a runtime warning.',
	 'It converts 5 to the closest member, B.'],
	'Before TS 5.0 numeric enums were assignable from any number. Since 5.0 every enum is a union enum and assigning an out-of-domain numeric literal is flagged. Assigning in-range values such as 1 is still allowed, and nothing is ever converted at runtime.');

add('basic',
	'utility-types',
	'Is `Readonly<{ tags: string[] }>` deeply immutable?',
	'No, it is shallow: the array can still be mutated.',
	['Yes, Readonly applies recursively to nested objects and arrays.',
	 'Yes, but only for arrays, not for objects.',
	 'No, it makes the whole object frozen only at runtime.'],
	'Readonly<T> just prefixes each top-level property with readonly. `r.tags = []` errors, but `r.tags.push("x")` compiles because string[] is still a mutable array. Use ReadonlyArray / `readonly string[]` for the inner level or write a recursive DeepReadonly. Nothing happens at runtime.');

add('basic',
	'narrowing',
	'What does Array.isArray narrow an unknown value to?',
	'any[] — the element type is unknown to the compiler.',
	['unknown[]',
	 'never[]',
	 'object'],
	'Array.isArray is declared as `arg is any[]`, so after the check you hold an array of any. If you want safety, treat the elements as unknown (`const items: unknown[] = v`) and validate each one. It does not narrow to the broader object type.',
	`function f(v: unknown) {
  if (Array.isArray(v)) {
    v; // any[]
  }
}`);

add('basic',
	'config',
	'What does the noImplicitAny flag (part of strict) report?',
	'Values or parameters whose type cannot be inferred and silently become any.',
	['Every explicit use of the any keyword.',
	 'Any variable that holds a value of type unknown.',
	 'Runtime values that turn out to have a different type than the one that was declared.'],
	'Explicit `any` is still allowed; noImplicitAny only complains when inference gives up and falls back to any. `function f(x) {}` is the classic case. It is a purely compile-time check and unrelated to unknown or runtime validation.');

add('basic',
	'indexed-access',
	'What is `string[][number]`?',
	'string — indexing an array type with number gives its element type.',
	['number',
	 'string[]',
	 'number | string'],
	'An indexed access type `T[K]` looks up the type at key K. Arrays are indexed by number, so `string[][number]` is the element type. This is the standard way to extract the element type of an array type, e.g. `(typeof items)[number]`.');

add('basic',
	'as-const',
	'How do you derive a union of the values of an object declared with `as const`?',
	'(typeof Colors)[keyof typeof Colors]',
	['Colors[keyof Colors] used directly as a type, without typeof',
	 'typeof Colors[number], which indexes the object by position',
	 'Values<Colors>'],
	'`keyof typeof Colors` gives the KEYS. Indexing the object type by its own keys gives the VALUES, and `as const` is what keeps them literal instead of string. `[number]` works only on arrays, and Values is not a built-in utility.',
	`const Colors = { red: "#f00", blue: "#00f" } as const;
type Color = (typeof Colors)[keyof typeof Colors]; // "#f00" | "#00f"`);

add('basic',
	'types',
	'How do the types `{}`, `object` and `unknown` differ?',
	'{} excludes only null/undefined, object excludes primitives, unknown accepts everything.',
	['They are interchangeable aliases for "any value" and differ only in how editors display them.',
	 '{} means an empty object and rejects all properties.',
	 'object accepts primitives but rejects functions.'],
	'`{}` is the type of "anything with a toString-like shape", so `const a: {} = 1` compiles, while `const b: object = 1` does not. `{}` still rejects null/undefined. unknown is the top type. `{}` does not mean "empty object" — use `Record<string, never>` for that.');

add('basic',
	'react-types',
	'Which type do you use for the return of a component in current @types/react (React 19)?',
	'React.JSX.Element, or just let it be inferred.',
	['The global JSX.Element, which is always available.',
	 'React.ReactDOM.Element',
	 'HTMLElement'],
	'@types/react 19 removed the global `JSX` namespace; it now lives at `React.JSX` (also importable as `JSX` from "react"). Most code just omits the annotation. HTMLElement is a DOM node type, not what JSX expressions evaluate to.',
	`import * as React from "react";
declare const a: JSX.Element;        // error: no global JSX
declare const b: React.JSX.Element;  // ok`);

add('basic',
	'react-types',
	'What type does `useState(null)` give the state variable?',
	'null, so setUser with an object is an error unless you pass a type argument.',
	['any',
	 'unknown',
	 'object | null, because React widens a null initial value to the likely object shape'],
	'With no type argument TypeScript infers the state type from the initial value, and `null` alone infers `null`. That makes `setUser({ name: "a" })` fail. Write `useState<User | null>(null)` to declare the real type.');

add('basic',
	'react-types',
	'What is the state type for `const [n, setN] = useState<number>();`?',
	'number | undefined, because no initial value was supplied.',
	['number',
	 'number | null, because no value means null',
	 'unknown'],
	'When you omit the initial value, React\'s typings add `undefined` to the state type (`useState<S = undefined>(): [S | undefined, ...]`). Provide an initial value or accept the undefined branch. null is only involved if you put it in the type argument.');

add('basic',
	'react-types',
	'In React 19 typings, what is the type of `ref` after `const ref = useRef<HTMLInputElement>(null)`?',
	'RefObject<HTMLInputElement | null>; check current for null',
	['MutableRefObject<HTMLInputElement>, so current is always defined.',
	 'RefObject<HTMLInputElement> whose current is read-only and never null.',
	 'A callback ref (instance: HTMLInputElement) => void'],
	'The element does not exist until after mount, so `current` starts as null. React 19 types unified refs: `useRef<T>(null)` returns `RefObject<T | null>` and `current` is writable. Use `ref.current?.focus()`. MutableRefObject was the older split pattern.',
	`const ref = useRef<HTMLInputElement>(null);
ref.current?.focus();
return <input ref={ref} />;`);

add('basic',
	'react-types',
	'Why does `<Card>hello</Card>` fail when Card declares `children: React.ReactElement`?',
	'A string is not a ReactElement; ReactNode accepts strings, numbers, null and elements.',
	['children is a reserved word and cannot be typed explicitly.',
	 'ReactElement only accepts exactly one child, so a text, number or array child is rejected.',
	 'JSX text is always typed as undefined.'],
	'ReactElement is the object returned by createElement/JSX. Text, numbers, booleans, null and arrays are not elements. ReactNode is the broad union for anything renderable, which is why it is the usual choice for children. Pick ReactElement only when you intentionally require a JSX element.');

add('basic',
	'react-types',
	'What changed about `React.FC` and children in current @types/react?',
	'FC no longer adds children; declare it yourself if needed.',
	['FC now requires a children prop on every component that uses it',
	 'FC was removed from the typings entirely.',
	 'FC automatically types children as string.'],
	'Up to @types/react 17 `FC` injected `children?: ReactNode`. From 18 onward it does not, which is the main reason people moved to plain functions with explicit props. FC still exists, and in 19 its return type also allows Promise<ReactNode> for async components.',
	`const Box: React.FC<{}> = () => null;
<Box>hi</Box>; // error: children not declared`);

add('basic',
	'react-types',
	'What does `React.ComponentProps<"button"> & { variant: "a" | "b" }` give you?',
	'Native button props (onClick, type, disabled...) plus a required variant.',
	['Only variant, because intersection keeps the right-hand side.',
	 'A union of the button props or the variant prop, so either one may be passed alone.',
	 'Button props with every property made optional.'],
	'ComponentProps<"button"> resolves to the intrinsic element\'s props (including ref in React 19). Intersecting with your own object adds members instead of replacing; variant stays required. It is a union only if you write `|`.');

add('basic',
	'react-types',
	'You pass `(e: MouseEvent) => void` to a button\'s onClick and get a type error. What is the correct handler event type?',
	'React.MouseEvent<HTMLButtonElement> — React uses synthetic event types.',
	['The DOM MouseEvent, but only when noImplicitAny is switched off in tsconfig.',
	 'Event, which every handler receives.',
	 'React.ClickEvent, which is specific to click.'],
	'The global `MouseEvent` is the browser\'s native event. React hands handlers a SyntheticEvent wrapper typed `React.MouseEvent<T>`, where T is the element so that `e.currentTarget` is typed. There is no React.ClickEvent type.',
	`<button onClick={(e: MouseEvent) => {}} />;                          // error
<button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {}} />; // ok`);

add('basic',
	'next-types',
	'Which statement about TypeScript errors and Next.js is accurate?',
	'next build fails on type errors; next dev strips types without blocking.',
	['next dev blocks every page until all type errors are fixed.',
	 'Type errors are always ignored, because SWC strips types before any checking.',
	 'next build only reports type errors as warnings.'],
	'SWC strips types without checking them, so dev compilation is not gated by the type checker. The production build runs a TypeScript check and fails the build on errors; `typescript.ignoreBuildErrors: true` opts out (dangerous). Run `tsc --noEmit` in CI or your editor to see errors early.');

add('basic',
	'next-types',
	'How are the `params` of an App Router page typed in Next.js 15 and later?',
	'A Promise: params: Promise<{ slug: string }>, read with await.',
	['As a plain object: `params: { slug: string }`.',
	 'As a tuple of the route segments, for example params: [string, string].',
	 'As a URLSearchParams instance.'],
	'Since Next 15 dynamic APIs such as `params` and `searchParams` are asynchronous so Next can render more before they are known. Destructuring them synchronously is now a type error (and a runtime warning). Dynamic segments are keyed by folder name, not exposed as tuples or URLSearchParams.');

add('basic',
	'next-types',
	'What do you gain by annotating `export const metadata: Metadata = { ... }` with the type from "next"?',
	'Compile-time checks and autocomplete, so a typo like titel is reported.',
	['Runtime validation that throws on invalid metadata.',
	 'Automatic generation of the sitemap and robots files during the production build.',
	 'The ability to use metadata in Client Components.'],
	'Metadata is just a type; it is erased at build time and validates nothing at runtime. The benefit is editor support and early errors. It does not create SEO files, and the metadata export is still only valid in Server Components.',
	`import type { Metadata } from "next";

export const metadata: Metadata = {
  titel: "Home", // error: did you mean 'title'?
};`);

add('basic',
	'config',
	'Why does `export { User } from "./types"` error when isolatedModules is enabled and User is an interface?',
	'A per-file transpiler cannot tell User is a type; write export type { User }.',
	['Interfaces can never be exported from a module.',
	 'isolatedModules forbids re-exporting anything at all.',
	 'The module must import User first and then export it in a separate second statement.'],
	'Tools like SWC/esbuild transpile each file alone and do not see the other file, so they cannot tell whether to keep or drop `User`. `export type { User } from "./types"` states the intent explicitly and is erased. Normal value re-exports are fine.');


// ───────────────────────── Mid ─────────────────────────

add('mid',
	'react-types',
	'With a discriminated-union action type, what does TypeScript do with `dispatch({ type: "add" })` when the add action also needs an `item`?',
	'An error: no Action member matches because item is missing.',
	['It accepts the call and passes item as undefined.',
	 'It accepts the call because dispatch is typed as (action: object) => void.',
	 'It only complains once the reducer\'s switch has a default case.'],
	'useReducer infers the action type from the reducer\'s second parameter. Each dispatch call is checked against the whole union, and `{ type: "add" }` matches no member because the add member requires `item`. dispatch is not loosened to object, and the default case is irrelevant to call-site checking.');

add('mid',
	'react-types',
	'How does TypeScript type the `it` parameter in this generic component call?',
	'T is inferred from items, so it is { id: number } and it.name errors.',
	['It is any, because generic components cannot infer T from their props.',
	 'It is unknown, which forces a type argument at every use site.',
	 'It is the whole props object.'],
	'Props are inference sites just like function arguments. `items={[{ id: 1 }]}` fixes T = { id: number }, which then contextually types the render callback. You only need `<List<Item> ...>` when inference has nothing to work with, e.g. an empty array.',
	`function List<T>({ items, render }: {
  items: T[];
  render: (item: T) => React.ReactNode;
}) { /* ... */ return null; }

<List items={[{ id: 1 }]} render={(it) => it.id} />;    // ok
<List items={[{ id: 1 }]} render={(it) => it.name} />;  // error`);

add('mid',
	'react-types',
	'Why is `createContext<Ctx | undefined>(undefined)` plus a custom hook that throws a common pattern?',
	'The hook narrows away undefined, and a missing provider fails loudly.',
	['createContext cannot accept undefined as a default without the as keyword.',
	 'The throw is required for Context to re-render consumers.',
	 'It makes the context value readonly for all consumers.'],
	'A default value has to exist at creation time, but a real provider value often does not. Using undefined as the default keeps the type honest; the hook\'s `if (!ctx) throw` narrows `Ctx | undefined` to Ctx. Faking a default object hides provider mistakes. The throw has nothing to do with re-rendering.',
	`const UserCtx = createContext<Ctx | undefined>(undefined);

function useUser(): Ctx {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser needs <UserCtx.Provider>");
  return ctx;
}`);

add('mid',
	'react-types',
	'In React 19, how can a function component receive a ref to forward to an inner input without forwardRef?',
	'ref is a normal prop for function components, so ComponentProps<"input"> already includes it.',
	['It cannot; forwardRef is the only way ref reaches a function component.',
	 'You must rename the prop to innerRef because ref is reserved and always stripped from props by React.',
	 'You need useImperativeHandle for every forwarded ref.'],
	'React 19 passes `ref` through props for function components, and ComponentProps<"input"> includes `ref?: Ref<HTMLInputElement>`. Spreading props onto the input is enough. forwardRef still works but is no longer required. Previously ref was stripped, hence the old workaround names.');

add('mid',
	'react-types',
	'What is `React.PropsWithChildren<{ a: number }>` equivalent to?',
	'{ a: number } & { children?: React.ReactNode | undefined }',
	['{ a: number; children: React.ReactNode }',
	 '{ a: number } | { children?: React.ReactNode | undefined }',
	 '{ a: number; children: JSX.Element }'],
	'PropsWithChildren intersects your props with an optional children of type ReactNode. The children are optional, not required, and the shape is an intersection rather than a union. It is a convenience; declaring `children?: React.ReactNode` yourself is equally valid and more explicit.');

add('mid',
	'react-types',
	'In `<button value="x" onClick={(e) => ...} />`, which expression is valid for the event type?',
	'e.currentTarget.value; target is only a generic EventTarget.',
	['e.target.value, because target is always the element with the handler.',
	 'Both e.target.value and e.currentTarget.value.',
	 'Neither; value cannot be read from a click event.'],
	'React types `currentTarget` as the element the handler is bound to (HTMLButtonElement here). `target` is the element that originated the event, which could be a nested child, so it is typed as the generic EventTarget and has no value. For ChangeEvent on inputs, the library types target specially, which is why e.target.value works there.',
	`<button
  value="x"
  onClick={(e) => {
    e.currentTarget.value; // ok
    e.target.value;        // error
  }}
/>;`);

add('mid',
	'react-types',
	'Why does `useRef<number>()` fail to compile with React 19 types?',
	'useRef needs an initial argument now; pass 0 (or null with a union type).',
	['useRef cannot hold numbers, only DOM elements.',
	 'The type argument has to be written as RefObject<number> for it to be accepted.',
	 'Mutable refs were removed from React 19.'],
	'In @types/react 19, useRef has no zero-argument overload (React 19 also made refs uniformly RefObject). `useRef<number>(0)` returns a mutable `RefObject<number>`. Refs for any value are still supported, just not with a missing initial value.');

add('mid',
	'react-types',
	'Why must a generic arrow function component in a .tsx file be written `<T,>(props) => ...`?',
	'A bare <T> looks like a JSX tag opener; the comma or extends disambiguates it.',
	['Generics on arrow functions are not allowed in .tsx files, only in plain .ts ones.',
	 'The comma makes T default to unknown.',
	 'T must be listed twice so React can infer it.'],
	'In .tsx files `<T>(p) => null` looks like JSX, producing parse errors such as "JSX element T has no corresponding closing tag". `<T,>` or `<T extends unknown>` parse as a type parameter list. Function declarations (`function List<T>()`) have no such ambiguity.');

add('mid',
	'react-types',
	'Why do consumers of this custom hook get the wrong types, and what fixes it?',
	'The array is inferred as a union array; use as const so it is a tuple.',
	['Hooks cannot return arrays; return an object instead.',
	 'useState wraps the value in a union type that cannot be unwrapped later.',
	 'The compiler needs the return type to be any[].'],
	'`[v, toggle]` is inferred as `(boolean | (() => void))[]`, so destructuring gives every element the union. `as const` makes it `readonly [boolean, () => void]` with a type per position. Returning objects also works but is a different API.',
	`function useToggle(init: boolean) {
  const [v, set] = useState(init);
  return [v, () => set(!v)] as const;
}
const [on, toggle] = useToggle(false); // boolean, () => void`);

add('mid',
	'react-types',
	'A component declares props `{ title: string }`. Which usage compiles?',
	'<Card title="a" data-testid="x" /> — hyphenated data-* and aria-* attributes are not checked.',
	['<Card title="a" testid="x" />, since unknown props are always ignored.',
	 'None; every extra attribute is a type error.',
	 '<Card title="a" data-testid="x" /> fails to compile unless the props extend HTMLAttributes<HTMLDivElement>.'],
	'JSX attribute names that contain a hyphen and are not declared in props are not type-checked, so data-testid and aria-* pass through. A plain unknown name like `testid` is still an excess property error. Note that such attributes only reach the DOM if the component actually forwards them.',
	`function Card(p: { title: string }) { return null; }

<Card title="a" data-testid="x" />; // ok
<Card title="a" testid="x" />;      // error`);

add('mid',
	'next-types',
	'Can an async function be used as a Server Component directly in JSX with current types?',
	'Yes — recent TS and @types/react accept components returning Promise<ReactNode>.',
	['No, async components must be wrapped in React.lazy for the types to accept them.',
	 'Only if the function returns a string.',
	 'Only in .js files, because TypeScript always rejects async components.'],
	'Since TS 5.1 (JSX.ElementType) and recent @types/react, a function whose return type is `Promise<ReactNode>` is a valid JSX element type. That is what makes `async function Page()` and `<AsyncChild />` compile in the App Router. Client Components cannot be async, but that is a runtime rule, not a typing one.');

add('mid',
	'next-types',
	'Why does `<form action={save} />` fail to type-check when save returns Promise<{ error: string }>?',
	'It expects void or Promise<void>; return state via useActionState instead.',
	['Server Actions must be synchronous functions, so any Promise-returning one is rejected.',
	 'action only accepts string URLs.',
	 'FormData cannot be the first parameter of an action.'],
	'`<form action>` accepts `string | ((formData: FormData) => void | Promise<void>)`. A function that resolves to an object is not assignable to Promise<void>. The idiom is `useActionState(fn, initial)`, which takes `(prev, formData) => Promise<State>` and returns a formAction that IS assignable.',
	`async function save(fd: FormData): Promise<{ error: string }> {
  "use server";
  return { error: "" };
}
<form action={save} />; // error

const [state, formAction] = useActionState(
  async (prev: { error: string } | null, fd: FormData) => ({ error: "x" }),
  null,
);
<form action={formAction} />; // ok`);

add('mid',
	'next-types',
	'What type does `searchParams.q` have on a page, and how do you get a single string safely?',
	'string | string[] | undefined; narrow with Array.isArray(q) ? q[0] : q.',
	['string, because Next guarantees exactly one value per query key and rejects repeats.',
	 'string | null; absent keys are null.',
	 'string[]; query values are always arrays.'],
	'Query keys can be absent (undefined) or repeated (?q=a&q=b gives an array), so the documented type is `{ [key: string]: string | string[] | undefined }`. Array.isArray narrows cleanly on `string[]` (not readonly), giving `string | undefined` for the ternary result. Remember to `await searchParams` first in Next 15+.');

add('mid',
	'next-types',
	'How is the context of a Route Handler such as app/users/[id]/route.ts typed in Next 15+?',
	'ctx.params is a Promise: { params: Promise<{ id: string }> }.',
	['ctx.params is a plain { id: string } object.',
	 'The id is passed as a second positional string argument after the request.',
	 'It is read from request.id on NextRequest.'],
	'Like pages, route handlers receive async params. Recent Next versions also provide a typegen-based global `RouteContext<"/users/[id]">` helper so you do not hand-write the shape. A NextRequest has no id property; route params are not positional arguments.',
	`export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return NextResponse.json({ id });
}`);

add('mid',
	'next-types',
	'What are the global PageProps and LayoutProps helpers in recent Next.js versions?',
	'Route-aware types generated by next dev/build/typegen, giving typed params.',
	['Types imported from "next/types" that describe any page, layout or component generically.',
	 'Runtime validators that check params when a page renders.',
	 'Aliases that are only available inside next.config.ts.'],
	'The helpers are generated into the project\'s types from your actual app folder structure, so a renamed folder changes the type automatically. They are globally available (no import) once types have been generated, and they are compile-time only. Hand-written `{ params: Promise<...> }` still works.');

add('mid',
	'next-types',
	'What does enabling `typedRoutes: true` in next.config add?',
	'Link hrefs and router navigation are checked against your real routes.',
	['Runtime redirects for any route that does not exist.',
	 'Automatic generation of a sitemap.',
	 'Type checking of the JSON bodies returned from your API routes and handlers.'],
	'Next generates a route union from the file system and makes `href` accept only valid paths, so a typo breaks the type check instead of producing a 404. It stabilised as a top-level option (earlier it lived under `experimental`). It does not redirect, build a sitemap, or check response bodies.');

add('mid',
	'zod',
	'For a zod schema with a default or a transform, how do z.input and z.infer differ?',
	'z.input is what parse accepts; z.infer (output) is what parse returns.',
	['They are identical for every schema.',
	 'z.infer is the pre-parse type and z.input is the post-parse type of the value.',
	 'z.input includes validation error messages.'],
	'`z.infer<typeof S>` is an alias of `z.output`. With `.default(1)` the input field may be omitted while the output always has it; with `.transform(...)` the output type is whatever the transform returns. Using the output type for a form\'s default values is a classic mismatch — use the input type there.',
	`const S = z.object({ n: z.number().default(1) });

type In = z.input<typeof S>;  // { n?: number | undefined }
type Out = z.infer<typeof S>; // { n: number }`);

add('mid',
	'narrowing',
	'Does TypeScript narrow `x` in this code when the discriminant was destructured into a const first?',
	'Yes, since TS 4.6 a destructured const discriminant narrows the parent.',
	['No, narrowing works only on direct property reads such as x.kind, never on aliases.',
	 'Only if kind was declared with let.',
	 'Only inside a switch statement, never an if.'],
	'Control-flow analysis tracks `const { kind } = x` as an alias of `x.kind` for discriminated unions, so `if (kind === "a")` narrows x. This lets you destructure for readability without losing narrowing. It works with if and switch alike.',
	`type A = { kind: "a"; a: number } | { kind: "b"; b: string };

function f(x: A) {
  const { kind } = x;
  if (kind === "a") {
    x.a; // ok, x is the "a" member
  }
}`);

add('mid',
	'narrowing',
	'What is the type of `r` here under TypeScript 5.5 or later?',
	'string[]; the arrow is inferred as a type predicate.',
	['(string | undefined)[], because filter never narrows.',
	 'string[], but only if the callback is annotated as x is string.',
	 'never[]'],
	'TS 5.5 infers `x is string` for callbacks that simply test `x !== undefined`, so `Array#filter` returns `string[]`. Older versions needed an explicit predicate. Not every check qualifies: `filter(Boolean)` and `filter(x => !!x)` still return `(string | undefined)[]`, and for numbers `!!x` cannot narrow because 0 is falsy.',
	`const arr = ["a", undefined, "b"];
const r = arr.filter((x) => x !== undefined);  // string[]
const s = arr.filter(Boolean);                 // (string | undefined)[]`);

add('mid',
	'narrowing',
	'Why does calling `assertIsString(v)` not narrow when it is a const arrow function without an annotation?',
	'Every name in the call must have an explicit type annotation; declarations work.',
	['Assertion functions only work with async functions.',
	 'asserts x is string is valid only on class methods.',
	 'Arrow functions are never callable as expression statements, only inside larger expressions.'],
	'To apply an assertion the compiler must know the function\'s type up front, so every name in the call has to have an explicit type annotation. A `function` declaration satisfies that; so does `const f: (x: unknown) => asserts x is string = ...`. An unannotated const arrow does not and gives error TS2775.');

add('mid',
	'generics',
	'Why does `same(1, "a")` fail when `declare function same<T>(a: T, b: T): T`?',
	'T is inferred from the first argument (number), so "a" fails; pass T explicitly.',
	['T is inferred as unknown and unknown rejects literals.',
	 'Generics must have different parameters for each argument.',
	 'TypeScript picks the last argument as the candidate and rejects the earlier arguments.'],
	'When several arguments feed the same type parameter, inference picks a best common candidate and checks the others against it. number and string do not unify automatically, so you get an error. `same<string | number>(1, "a")` works. Declaring separate T and U parameters avoids the problem.');

add('mid',
	'config',
	'What does enabling noUncheckedIndexedAccess change?',
	'Index reads (arr[0], rec.foo) gain undefined; map, for-of and tuples are unaffected.',
	['All array methods return undefined whenever the array happens to be empty at runtime.',
	 'Array lengths must be known at compile time.',
	 'It makes arrays readonly.'],
	'The flag models that an index may be out of range. `arr[0]` becomes `T | undefined`, as do `const [first] = arr` and `record[key]`. Iteration (for-of, map) still yields T, and tuples keep exact element types. It is not part of strict, so teams opt in separately.',
	`const arr = [1, 2, 3];
const a: number = arr[0];      // error: number | undefined
const [b]: number[] = arr;     // b is number | undefined
for (const x of arr) {}        // x is number`);

add('mid',
	'config',
	'What does exactOptionalPropertyTypes do to `{ a?: number }`?',
	'Omitting is fine, but explicitly assigning undefined becomes an error.',
	['It makes a required instead of optional.',
	 'It allows null in addition to undefined.',
	 'It changes how optional parameters behave in function calls and default arguments.'],
	'By default `a?: number` means `number | undefined` and an explicit `{ a: undefined }` is accepted. With the flag, "absent" and "present but undefined" are distinguished: write `a?: number | undefined` if undefined is a legal value. It only affects properties, not parameters.');

add('mid',
	'config',
	'What does noImplicitOverride require?',
	'Overriding members need the override keyword (and it is an error without a base member).',
	['Every method in a subclass must call super.',
	 'Abstract methods must always be implemented as arrow function properties, never as methods.',
	 'Class properties must be declared before methods.'],
	'The flag turns overriding into an explicit act, so renaming a base method no longer leaves a subclass method silently turned into an unrelated one. `override` on something that does not exist in the base class is also reported. It does not enforce super calls.',
	`class Base { run() {} }
class A extends Base { run() {} }            // error with the flag
class B extends Base { override run() {} }   // ok`);

add('mid',
	'config',
	'What does verbatimModuleSyntax enforce?',
	'Imports and exports are emitted as written, so types need import type / type modifiers.',
	['All import statements are rewritten into CommonJS require calls in the emitted JavaScript.',
	 'Type-only imports are kept at runtime for side effects.',
	 'Default imports are disallowed.'],
	'With the flag, anything without a `type` modifier is preserved in the output, so a plain `import { User }` of an interface is error TS1484. That makes emit predictable for bundlers and per-file transpilers, replacing importsNotUsedAsValues. `import { type User, v }` keeps `v` and drops `User`.');

add('mid',
	'config',
	'What is a key difference between moduleResolution "bundler" and "nodenext" for relative imports?',
	'nodenext needs explicit extensions in ESM relative imports (./a.js); bundler does not.',
	['bundler requires .ts extensions; nodenext forbids them.',
	 'nodenext ignores the package.json "exports" field entirely, while bundler honours it in full.',
	 'bundler only works with CommonJS output.'],
	'nodenext mirrors Node\'s real ESM rules, so `import "./a"` fails with TS2835 and you write `./a.js`, even for a .ts source. bundler models what Vite, webpack and Next do: extensionless relative paths are fine. Both honour package.json "exports" and both support ESM.',
	`// nodenext, "type": "module"
import { a } from "./a";     // error TS2835
import { a } from "./a.js";  // ok`);

add('mid',
	'config',
	'What does the erasableSyntaxOnly flag (TS 5.8) forbid?',
	'Syntax needing real emit: enums, runtime namespaces, parameter properties, <T>x assertions.',
	['Any use of generics or interfaces.',
	 'Type annotations on function parameters, return types, and variable declarations in exported code.',
	 'Every import type statement.'],
	'The flag exists so that "strip the types" runtimes (Node\'s type stripping, etc.) can run your files unchanged. Enums, `namespace X { ... }`, `constructor(private x: number)` and `<T>value` all need real code generation, so they are errors. Interfaces, annotations and import type are erased and still fine.');

add('mid',
	'config',
	'You compile with target es2020 and call `[1].at(0)`. Why does this fail, and what fixes it?',
	'lib supplies the built-in types; raise target or add lib: ["es2022"].',
	['target controls only syntax, so .at is a missing runtime polyfill that TypeScript cannot detect.',
	 'Array.prototype.at is not part of any ECMAScript edition.',
	 'It fails only when strict is false.'],
	'`target` decides which syntax is downlevelled; `lib` (defaulted from target) decides which globals and methods exist in the type system. `.at` was added in ES2022, so es2020 libs lack it and you get TS2550. Note the library check does not add a polyfill: you still need a runtime that supports it.');

add('mid',
	'config',
	'You add `"references": [{ "path": "../lib" }]` to a tsconfig and get TS6306. What is the cause?',
	'The referenced project must set "composite": true.',
	['The path must point to a specific file, not to a folder.',
	 'References only work with "module": "commonjs".',
	 '"incremental" must be false in both projects.'],
	'Project references require each referenced project to be composite, which turns on declaration output and a stable file list, enabling `tsc -b` to build in dependency order and reuse results. The path can point at a folder containing a tsconfig. incremental is implied by composite, not forbidden.');

add('mid',
	'declaration-merging',
	'How do you allow custom CSS variables like `style={{ "--gap": "4px" }}` without a type assertion?',
	'Augment CSSProperties with a template-literal index signature.',
	['Pass the object through any.',
	 'Turn off excess property checks with strict: false.',
	 'Use a CSS file; inline custom properties are impossible in TSX.'],
	'The `--*` names are not in csstype\'s Properties, so they raise an excess property error. Merging `interface CSSProperties { [key: `--${string}`]: string | number | undefined }` via `declare module "react"` types every such key. The file must be a module (have an import or export) so the declaration is an augmentation rather than a replacement.',
	`import "react";
declare module "react" {
  interface CSSProperties {
    [key: \`--\${string}\`]: string | number | undefined;
  }
}

<div style={{ "--gap": "4px" }} />; // ok`);

add('mid',
	'declaration-merging',
	'You type your env vars via `interface ProcessEnv` in `declare global { namespace NodeJS { ... } }`. What do you get?',
	'The declared keys become string instead of string | undefined.',
	['Every property of process.env becomes string.',
	 'The compiler checks at build time that the variable exists in .env.',
	 'process.env becomes a read-only object.'],
	'Declaration merging adds named properties to NodeJS.ProcessEnv, so those keys are typed string; undeclared keys stay `string | undefined`. This is only a promise: nothing verifies the env file, so a missing variable still yields undefined at runtime. Validate with a schema (e.g. zod) at startup for real safety.');

add('mid',
	'declaration-files',
	'Why does `declare module "*.svg"` fail with "Invalid module name in augmentation" inside a file that has top-level imports?',
	'It is a module, so declare module augments; use a script .d.ts without imports/exports.',
	['Wildcard module declarations are only supported in tsconfig "paths", never in .d.ts files.',
	 'declare module can only be used in .tsx files.',
	 '.svg is not a valid file extension for modules.'],
	'In a script file (no top-level import/export), `declare module "*.svg"` declares a new ambient module pattern. In a module file the same syntax is interpreted as augmenting an existing module, and "*.svg" cannot be found. Next.js avoids this for you in the generated next-env.d.ts, which references its own image typings.',
	`// svg.d.ts  (no imports/exports)
declare module "*.svg" {
  const src: string;
  export default src;
}`);

add('mid',
	'resource-management',
	'What does `using` need in order to compile (TypeScript 5.2+)?',
	'The initializer needs [Symbol.dispose]() (or null/undefined) and lib esnext.disposable.',
	['Only a try/finally block around it; no special method is required.',
	 'The variable must be declared with let and a finalize method.',
	 'It works only with async functions and Promise-returning values, never with plain objects.'],
	'`using` calls `[Symbol.dispose]()` when the scope exits, like a deterministic finally. If the lib lacks Symbol.dispose you get TS2318/TS2550, and an initializer without the method is TS2850. `await using` is the async variant with `Symbol.asyncDispose`. It is not tied to Promises.');

add('mid',
	'generics',
	'What does the const modifier on a type parameter do in `function f<const T extends readonly unknown[]>(x: T)`?',
	'It infers the argument as if as const were applied: readonly [1, "a"].',
	['It makes T impossible to change after the call.',
	 'It forces callers to pass a variable instead of an inline literal at the call site.',
	 'It converts the argument into a frozen object at runtime.'],
	'Const type parameters (TS 5.0) preserve literal and tuple types of inline arguments without callers writing `as const`. The constraint must allow readonly (`readonly unknown[]`) or the mutable array constraint will reject the inferred readonly tuple. It is compile-time only.',
	`declare function f<const T extends readonly unknown[]>(x: T): T;
const t = f([1, "a"]);  // readonly [1, "a"]`);

add('mid',
	'generics',
	'What does NoInfer (TS 5.4) do in `function pick<T extends string>(opts: T[], def: NoInfer<T>): T`?',
	'T comes only from opts; a def outside that set is an error.',
	['It makes def optional.',
	 'It removes T from the return type.',
	 'It turns off type checking for def and treats it as any inside the body.'],
	'Without NoInfer the compiler would collect candidates from both opts and def and could widen T to include "c", silently accepting a bad default. NoInfer marks a position as check-only, not a candidate source. It is purely an inference hint and does not make the parameter optional.');

add('mid',
	'satisfies',
	'What does `["/a", "/b"] as const satisfies readonly string[]` give you?',
	'The literal tuple is kept and still validated against string[].',
	['It widens the elements to string.',
	 'It makes the array mutable again.',
	 'It only compiles when the array has exactly one item in it, no more.'],
	'`as const` alone keeps literals but cannot check against a contract. `satisfies` validates without changing the inferred type. Combined, `(typeof routes)[number]` is exactly "/a" | "/b" and a non-string element would be rejected. A plain annotation would have widened it to string[].',
	`const routes = ["/a", "/b"] as const satisfies readonly string[];
type Route = (typeof routes)[number]; // "/a" | "/b"`);

add('mid',
	'utility-types',
	'How do you get the resolved data type of an async function getUser without declaring it twice?',
	'Awaited<ReturnType<typeof getUser>>',
	['Promise<ReturnType<typeof getUser>>',
	 'Parameters<typeof getUser>[0]',
	 'typeof getUser()'],
	'ReturnType of an async function is `Promise<User>`; Awaited unwraps it to User. This is useful in Server Components where the data type should follow the fetcher automatically. Using ReturnType alone leaves the promise in place, and you cannot call a function inside a type query.');

add('mid',
	'utility-types',
	'What do ConstructorParameters<typeof K> and InstanceType<typeof K> return for a class K?',
	'A tuple of the constructor arguments, and the instance type K.',
	['The static members of the class, and the type of its prototype object.',
	 'The type of K itself, and an array of its methods.',
	 'Both return the same tuple of constructor arguments.'],
	'Both utilities take the constructor function type (`typeof K`). ConstructorParameters yields a labelled tuple such as `[a: string, b?: number]`; InstanceType yields what `new K()` produces. Passing the instance type `K` instead of `typeof K` is the common mistake and fails the constraint.',
	`class K { constructor(public a: string, b?: number) {} }

type P = ConstructorParameters<typeof K>; // [a: string, b?: number]
type I = InstanceType<typeof K>;          // K`);

add('mid',
	'utility-types',
	'What is Required<{ a?: string | undefined }>?',
	'{ a: string }',
	['{ a: string | undefined }',
	 '{ a?: string }',
	 '{ a: never }'],
	'Required<T> is `{ [K in keyof T]-?: T[K] }`; the `-?` removes optionality and also removes `undefined` from the property type (outside of exactOptionalPropertyTypes subtleties). That is why a Partial -> Required round trip is not always lossless when undefined was a deliberate member.');

add('advanced',
	'react-types',
	'What does this polymorphic Box enforce at the call site?',
	'Props follow the chosen element: as="a" accepts href, as="div" with href errors.',
	['Any prop is accepted because as makes the component untyped.',
	 'Only props shared by every HTML element are accepted, which excludes href entirely.',
	 'The as prop is optional only for custom components.'],
	'`C extends React.ElementType` is inferred from `as`, and `React.ComponentProps<C>` then yields that element\'s props. Omitting `as` falls back to the default type parameter (div). Omit<..., "as"> avoids a clash if the target component declares its own `as`. Inside the implementation you usually need a loose ElementType cast.',
	`type BoxProps<C extends React.ElementType> =
  { as?: C } & Omit<React.ComponentProps<C>, "as">;

function Box<C extends React.ElementType = "div">({ as, ...rest }: BoxProps<C>) {
  const Comp: React.ElementType = as ?? "div";
  return <Comp {...rest} />;
}

<Box as="a" href="/x">hi</Box>;   // ok
<Box as="div" href="/x">hi</Box>; // error`);


// ───────────────────────── Advanced ─────────────────────────

add('advanced',
	'utility-types',
	'Given `type A = { kind: "a"; a: number } | { kind: "b"; b: string }`, what is `Omit<A, "kind">`?',
	'{} — Omit is not distributive and keyof the union is only "kind".',
	['{ a: number } | { b: string }, because Omit distributes over each member',
	 '{ a?: number; b?: string }',
	 'never'],
	'Omit<T, K> is `Pick<T, Exclude<keyof T, K>>`, and `keyof (X | Y)` is only the keys common to both members. After removing "kind" no keys remain. To remove a key from each member write a distributive helper: `T extends unknown ? Omit<T, K> : never`.');

add('advanced',
	'variance',
	'Why is the second assignment an error while the first compiles?',
	'Methods are bivariant; function-typed properties are contravariant under strictFunctionTypes.',
	['Methods must not have parameters, so the first assignment is actually a compiler bug in strict mode.',
	 'strictFunctionTypes only applies to generic functions.',
	 'Property types are compared by name, not structure.'],
	'strictFunctionTypes makes parameters of function TYPES contravariant, so a handler of Dog cannot stand in for a handler of Animal. Methods declared with method syntax are intentionally exempt (bivariant) to keep common patterns such as DOM or Array methods working. The structural check applies to both; only the parameter variance differs.',
	`interface Animal { name: string }
interface Dog extends Animal { bark(): void }

declare const m: { handle(d: Dog): void };
declare const p: { handle: (d: Dog) => void };

const a: { handle(a: Animal): void } = m;       // ok (method, bivariant)
const b: { handle: (a: Animal) => void } = p;   // error`);

add('advanced',
	'variance',
	'Why does `const animals: Animal[] = dogs` compile, and what is the consequence?',
	'Arrays are covariant (unsound): pushing a non-Dog via Animal[] corrupts dogs.',
	['It is a compiler bug that strict mode fixes.',
	 'Arrays are invariant, so the assignment is actually reported as an error in strict mode.',
	 'TypeScript copies the array when widening, so it is safe.'],
	'For practicality TypeScript allows `Dog[]` where `Animal[]` is expected, even though the target can write. Read-only usage is perfectly safe, which is why `readonly Animal[]` is the honest type for parameters you do not mutate. Strict mode does not change array variance.');

add('advanced',
	'variance',
	'What does the compiler do with `interface Producer<out T> { set: (v: T) => void }`?',
	'It is rejected: T is used contravariantly, contradicting out.',
	['It accepts it and treats T as invariant.',
	 'The out modifier is ignored on interfaces.',
	 'It accepts it, but only for class declarations and never for interfaces.'],
	'Variance annotations (TS 4.7) are verified against how T is used. `out` promises T appears only in output positions; a function-typed property that takes T violates that, and the error mentions that sub-T is not assignable to super-T. Note that a method-syntax member is bivariant and would slip through unchecked.',
	`interface Producer<out T> { get: () => T }          // ok
interface Bad<out T> { set: (v: T) => void }        // error`);

add('advanced',
	'conditional-types',
	'What does `type IsNever<T> = T extends never ? true : false` evaluate to for IsNever<never>?',
	'never',
	['true',
	 'false',
	 'boolean'],
	'A naked type parameter distributes over its union members; never is the union with zero members, so there is nothing to evaluate and the result is never. Wrap both sides in tuples to turn distribution off: `[T] extends [never] ? true : false` gives true.');

add('advanced',
	'mapped-types',
	'What does this mapped type with an `as` clause produce for { onClick: 1; id: 2; onFocus: 3 }?',
	'{ onClick: 1; onFocus: 3 }',
	['{ onClick: 1; id: never; onFocus: 3 }',
	 '{ id: 2 }',
	 '("onClick" | "onFocus")[]'],
	'In key remapping (`as`), a key that maps to never is filtered out of the result entirely, which is the idiom for picking keys by pattern. It does not keep a property with type never. The result is an object type, not an array of keys.',
	`type Handlers<T> = {
  [K in keyof T as K extends \`on\${string}\` ? K : never]: T[K];
};`);

add('advanced',
	'mapped-types',
	'What does `{ -readonly [K in keyof T]-?: T[K] }` do to `{ readonly a?: number }`?',
	'{ a: number }',
	['{ readonly a: number }',
	 '{ a?: number }',
	 '{ readonly a?: number }'],
	'Mapped types can add or subtract modifiers with `+`/`-`. `-readonly` drops readonly and `-?` drops optionality, and the latter also strips undefined from the value type. Without any modifier the mapped type (homomorphic over keyof T) would preserve both from the source.',
	`type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };
type R = Mutable<{ readonly a?: number }>; // { a: number }`);

add('advanced',
	'template-literal-types',
	'What does this type compute for `Params<"/users/:id/posts/:postId">`?',
	'"id" | "postId"',
	['"/users/:id/posts/:postId"',
	 'string',
	 '["id", "postId"]'],
	'Template literal types support `infer` in string positions, and recursion lets the type walk the path. Each match peels one `:param/` and recurses on the rest, ending with the final `:param`. Results are collected into a union, not a tuple, because each branch returns a single literal.',
	`type Params<R extends string> =
  R extends \`\${string}:\${infer P}/\${infer Rest}\`
    ? P | Params<\`/\${Rest}\`>
    : R extends \`\${string}:\${infer P}\`
      ? P
      : never;`);

add('advanced',
	'conditional-types',
	'What does `S extends `${infer N extends number}` ? N : never` produce for "42" (TS 4.8+)?',
	'The number literal 42',
	['The string literal "42".',
	 'number',
	 'never, because strings are never assignable to number.'],
	'Since TS 4.8, `infer N extends number` inside a template literal tries to parse the matched text as the constraint type, so "42" becomes 42, "true" -> true and so on. If the text is not a valid number literal it falls back to the false branch. The result is the literal, not the wider number.');

add('advanced',
	'utility-types',
	'Which overload does ReturnType<typeof ov> use for an overloaded function?',
	'The last declared overload signature.',
	['The first declared overload.',
	 'A union of all overload return types.',
	 'The implementation signature.'],
	'Inference against overloaded types (infer from a function type) only considers the last signature, so `ReturnType` and `Parameters` return that one\'s types. The implementation signature is invisible to callers and to these utilities. If you need all of them, you must spell out the overload set yourself.',
	`declare function ov(x: string): string;
declare function ov(x: number): number;

type R = ReturnType<typeof ov>;  // number
type P = Parameters<typeof ov>;  // [x: number]`);

add('advanced',
	'functions',
	'What do ThisParameterType and OmitThisParameter give for `function greet(this: { name: string }, g: string): string`?',
	'{ name: string } and (g: string) => string',
	['string and (this: { name: string }) => string.',
	 'never for both; this is not a real parameter.',
	 'Both return (g: string) => string.'],
	'A `this` parameter is a type-only annotation that describes how the function must be called. ThisParameterType extracts it, and OmitThisParameter removes it from the signature so the function can be called or passed as a plain callback. Calling greet("hi") directly would still be an error because `this` is missing.',
	`function greet(this: { name: string }, g: string) {
  return g + this.name;
}
type T = ThisParameterType<typeof greet>;   // { name: string }
type F = OmitThisParameter<typeof greet>;   // (g: string) => string`);

add('advanced',
	'branded-types',
	'Why can `type USD = number & { readonly __brand: "USD" }` stop you from passing a plain number?',
	'No plain number has the phantom brand, so only cast/constructed values fit.',
	['The compiler checks the brand at runtime and throws when it is missing from a value.',
	 'Intersections with number always reduce to never.',
	 'It works only when the brand property is optional.'],
	'Branding exploits structural typing: you add a property that no ordinary value has, making two otherwise identical primitives incompatible. USD is still assignable to number (the intersection is a subtype), but not vice versa. The brand never exists at runtime — it is erased, so validation must happen in the function that creates the branded value.');

add('advanced',
	'branded-types',
	'Why use a `unique symbol` as the brand key instead of a string property like __brand?',
	'Each unique symbol is a distinct key an object literal cannot forge by accident.',
	['unique symbols are stored in the object at runtime so they can be validated later.',
	 'A string brand property cannot be used in an intersection.',
	 'Symbols make the type work in JSON.'],
	'A string-keyed brand such as `__brand` can be added by anybody who knows the name. A `declare const brand: unique symbol` key is only reachable by code that imports it, and the symbol never has to exist at runtime when declared with `declare`. It also lets you carry a type parameter for the brand.',
	`declare const brand: unique symbol;
type Id<T extends string> = string & { readonly [brand]: T };

declare const uid: Id<"user">;
const pid: Id<"post"> = uid; // error`);

add('advanced',
	'conditional-types',
	'What does `{ [K in A["kind"]]: Extract<A, { kind: K }> }` build for a discriminated union A?',
	'An object keyed by each kind, whose values are the matching members.',
	['A union of all members.',
	 'A tuple of the union members in declaration order, one entry per member.',
	 'The union of the kind strings only.'],
	'Iterating `A["kind"]` yields each literal key, and `Extract<A, { kind: K }>` selects the member whose kind is K. The result is a lookup table, useful for typed reducers, handler maps or event emitters where `Handlers["b"]` is exactly the b member. It is an object, not a union or tuple.');

add('advanced',
	'interfaces',
	'What happens when `interface B extends A1 { x: number }` redeclares x: string from A1, compared with `A1 & { x: number }`?',
	'extends errors at declaration; the intersection compiles and x becomes never.',
	['Both compile and x is string | number.',
	 'Both are errors at declaration.',
	 'The interface merges both declarations, giving x: string & number, if it is marked override.'],
	'`extends` requires the derived type to be assignable to the base, so an incompatible property is reported at the declaration. An intersection never errors there; it silently intersects the property types, `string & number` = never, and the problem appears when you try to build a value. Prefer interface extends when you want conflicts caught early.',
	`interface A1 { x: string }
interface B1 extends A1 { x: number }  // error
type C1 = A1 & { x: number };          // C1["x"] is never`);

add('advanced',
	'tuples',
	'Is `readonly [1, 2]` assignable to the mutable tuple `[1, 2]`?',
	'No — a readonly tuple cannot be assigned to a mutable one.',
	['Yes, readonly is erased during assignability checks.',
	 'Yes, but only for tuples shorter than three elements.',
	 'No, tuples can never be assigned between two different tuple types at all.'],
	'The reverse direction (mutable to readonly) is allowed because the readonly view can only do less. readonly-to-mutable would let callers mutate something promised immutable, so the compiler rejects it. This also explains why `as const` arrays cannot be passed to functions expecting `string[]`; type those parameters as `readonly string[]`.');

add('advanced',
	'tuples',
	'What is `[name: string, age?: number]["length"]`, and what does `[...A, ...B]` allow in generics?',
	'1 | 2, and variadic spreads let you concatenate tuple types.',
	['number for both.',
	 '2 — optional elements still count — and spreads are only allowed on arrays.',
	 '1 — optional elements are excluded — and spreads are not allowed in types.'],
	'Tuples may have optional and rest elements; the `length` property reflects possible lengths, so with one optional element it is 1 | 2. Variadic tuple types (TS 4.0) let `[...A, ...B]` splice two generic tuples preserving every element type, which is what typed `concat`, `curry` and `Parameters`-style wrappers rely on.',
	`type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];
type R = Concat<[1, 2], ["a"]>;  // [1, 2, "a"]

type L = [name: string, age?: number]["length"]; // 1 | 2`);

add('advanced',
	'narrowing',
	'What does `"x" in o` do to `o: object` in the true branch (TS 4.9+)?',
	'It narrows o to object & Record<"x", unknown>; o.x is unknown.',
	['It keeps o as plain object, so reading o.x is still an error afterwards.',
	 'It narrows o to { x: any }.',
	 'It throws at compile time because x is not declared.'],
	'Before 4.9, `in` narrowing worked only on union members. Now, for types that do not list the property, the compiler intersects with `Record<"x", unknown>` so the property can be read, though only as unknown. That makes `in` a safe way to probe unknown-shaped objects, still requiring a further check on the value.');

add('advanced',
	'overloads',
	'With overloads `(x: unknown): "u"` declared before `(x: string): "s"`, what is the type of `fn("a")`?',
	'"u" — the first matching overload wins.',
	['"s", because the compiler picks the most specific match.',
	 '"u" | "s", a union of all matching overloads.',
	 'It is an error because the signatures overlap.'],
	'Overload resolution tries signatures in declaration order and takes the first one the arguments satisfy. unknown accepts a string, so the specific overload below it is never chosen. TypeScript does not rank candidates by specificity and does not union them.',
	`declare function fn(x: unknown): "u";
declare function fn(x: string): "s";

const r = fn("a"); // "u"`);

add('advanced',
	'narrowing',
	'Why does `Array.isArray(x)` fail to narrow `x: string | readonly string[]` properly?',
	'any[] in the true branch; the else branch keeps the readonly array too.',
	['Array.isArray never works with unions.',
	 'It narrows correctly; the issue only appears with tuples.',
	 'It removes string in the true branch but only works when strict is off.'],
	'The guard is `arg is any[]`. A readonly array is not assignable to any[], so TypeScript cannot treat the readonly member as matched; the false branch keeps the full union. It is a long-standing limitation. Use a custom guard (`x is readonly unknown[]`) or `typeof x === "string"` to narrow the other way.');

add('advanced',
	'literal-types',
	'What is the purpose of `"a" | "b" | (string & {})` in an API type?',
	'It accepts any string but keeps autocomplete for "a" and "b".',
	['It restricts values to "a" or "b" only.',
	 'It forces string inputs to be non-empty.',
	 'It makes the type behave like never for any unknown string value passed in.'],
	'A bare `"a" | "b" | string` collapses to string, losing suggestions. Intersecting string with {} produces a distinct type that the compiler does not reduce, so the union keeps its literal members. It is a compile-time trick (often named LiteralUnion) with no runtime effect or validation.',
	`type Size = "sm" | "lg" | (string & {});
const a: Size = "sm";    // suggested
const b: Size = "xl";    // still allowed`);

add('advanced',
	'react-types',
	'Does `<Comp {...extra} />` get excess property checking for properties that come through the spread?',
	'No — excess checks apply only to explicit attributes and fresh literals, not spreads.',
	['Yes, every spread is checked against the props type key by key, exactly like attributes.',
	 'Yes, but only when strict is enabled.',
	 'No, because JSX attributes are always typed any.'],
	'Excess property checking targets "fresh" literals, so inline `{ a: 1, zzz: 2 }` fails. Spreading an existing object (even in JSX) is treated as ordinary structural assignment, where extra properties are fine. This is why a spread of unknown props can leak unwanted attributes into DOM elements.');

add('advanced',
	'narrowing',
	'How does `switch (true)` narrow in this example (TS 5.3+)?',
	'Each case is applied as a type guard, so x narrows per clause and default sees number.',
	['It does not narrow; TypeScript only narrows when switching directly on the variable x.',
	 'It narrows only if the conditions use ===.',
	 'It narrows every clause to never.'],
	'TS 5.3 added narrowing for `switch (true)`: the compiler applies the case expression as a type guard, including previous cases being false for later ones. This enables an if/else-if chain written as a switch while retaining narrowing. Before 5.3 the variable stayed un-narrowed in those clauses.',
	`function f(x: string | number) {
  switch (true) {
    case typeof x === "string":
      x; // string
      break;
    default:
      x; // number
  }
}`);

add('advanced',
	'keyof',
	'What are `keyof Record<string, 1>` and `keyof { [k: string]: 1 }`?',
	'string, and string | number respectively.',
	['string | number for both.',
	 'never for both, because the keys are unknown.',
	 'string for both.'],
	'Record<string, V> is a mapped type over `string`, so keyof yields string. A raw string index signature also admits numeric keys (obj[0] is obj["0"]), so keyof gives string | number. Subtle, but relevant when you build helpers like `Object.keys`-based getters on dictionary types.',
	`type A = keyof Record<string, 1>;       // string
type B = keyof { [k: string]: 1 };      // string | number`);

add('advanced',
	'functions',
	'How does a call on `((x: string) => number) & ((x: number) => string)` resolve?',
	'It acts like overloads: fn("a") is number and fn(1) is string.',
	['It cannot be called; intersections of functions are never.',
	 'Both signatures apply at once and the result is number & string.',
	 'Only the first signature is callable.'],
	'Callable members of an intersection are collected as an overload set in order. This is how patterns like `Fn1 & Fn2` or merging a function type with properties work. Unlike a union of functions (where parameters intersect), an intersection keeps each signature separately callable.');

add('advanced',
	'config',
	'In TypeScript 6.0, what happens to the global `process` when tsconfig has no "types" entry and @types/node is installed?',
	'It is not found: types now defaults to empty, so list "node" explicitly.',
	['It is found, because every installed @types package is still always included.',
	 'It is found, but typed as any.',
	 'It is found only when strict is false.'],
	'Older versions auto-included all visible @types/* packages. TypeScript 6.0 changed the default so global types come in only when listed (or imported), which speeds up builds and avoids surprise globals. The error text suggests installing types and adding "node" to the types field. The same release also turns strict on by default.',
	`// tsconfig.json
{ "compilerOptions": { "types": ["node"] } }

// without it:
process.env.X; // error: Cannot find name 'process'`);

add('advanced',
	'config',
	'What does isolatedDeclarations (TS 5.5) require of exported code?',
	'Exports need explicit annotations, e.g. return types, so .d.ts needs no cross-file inference.',
	['Every file must contain only declarations and no code.',
	 'Exports are forbidden from importing other modules.',
	 'All exported types must be written as interfaces, never as type aliases, inferred unions or mapped types.'],
	'The flag lets tools emit declaration files per file in parallel, because they never need to infer an exported type from another module. In practice you annotate exported functions\' return types and complex exported constants; simple literals are fine. Code itself is unchanged and imports remain allowed.',
	`export function f(a: number) { return a + 1; } // error: needs return type
export function g(a: number): number { return a + 1; } // ok`);

add('advanced',
	'satisfies',
	'What is the difference in `keyof typeof conf` between `const conf = {...} satisfies Record<string, X>` and `const conf: Record<string, X> = {...}`?',
	'satisfies keeps literal keys ("a" | "b"); the annotation widens to string.',
	['They are identical; both give string.',
	 'The annotation keeps the literal keys, while satisfies widens them all the way to string.',
	 'Both give "a" | "b" because the object is a const.'],
	'An annotation replaces the inferred type with the declared one, so the specific keys are forgotten and any key reads as X. satisfies only validates, leaving the inferred object type intact, so `keyof typeof conf` is exact and typos in lookups are errors. This is the standard way to type config maps while keeping them navigable.',
	`const conf = { a: { x: 1 }, b: { x: 2 } } satisfies Record<string, { x: number }>;
type K = keyof typeof conf;  // "a" | "b"`);

add('mid',
	'config',
	'Why does an alias such as "@/*": ["./src/*"] under tsconfig paths work in a Next.js app?',
	'Next.js resolves tsconfig paths itself; tsc only type-checks them and never rewrites imports.',
	['TypeScript rewrites the alias import specifiers in the emitted JavaScript into relative file paths.',
	 'The paths option installs a runtime module map that the browser consults whenever the page loads.',
	 'Every alias must also be registered as a local package inside node_modules before it can resolve.'],
	'The `paths` option only teaches the type checker how to resolve specifiers; tsc does not rewrite them in emitted code, which is why a plain tsc/node build of aliased imports breaks at runtime. Next.js has built-in support for `paths` and `baseUrl`, so its bundler resolves the same aliases. The browser has no module map for them, and nothing needs to live in node_modules.',
	`// tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}

import { Button } from "@/components/Button";`);

add('advanced',
	'mapped-types',
	'Why does a recursive DeepReadonly usually special-case function types before mapping over object types?',
	'A mapped type over a function yields {}, so the call signature would be lost.',
	['Functions cannot have readonly properties, so the mapped type would throw an error.',
	 'Without the check, the recursion would never terminate for any function-valued property.',
	 'TypeScript forbids the readonly modifier on members whose type is callable in any form.'],
	'Functions satisfy `T extends object`, and a homomorphic mapped type over a function type keeps only its (usually empty) own properties, producing `{}` with no call signature. A property like `cb: () => void` then becomes uncallable. The recursion terminates fine, and readonly on a callable member is legal; the issue is purely the lost signature.',
	`type DR<T> = T extends object
  ? { readonly [K in keyof T]: DR<T[K]> }
  : T;

declare const f: DR<{ cb: () => void }>;
f.cb(); // error: {} has no call signatures

type DR2<T> = T extends (...a: any[]) => any
  ? T
  : T extends object ? { readonly [K in keyof T]: DR2<T[K]> } : T;`);

export const typescriptQuestions = out;
