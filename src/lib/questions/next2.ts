import { builder } from '../types';

const { out, add } = builder('NB', 'next');

// ───────────────────────── Basics ─────────────────────────

add('basic', 'caching',
	'In Next.js 15, what changed about `fetch` caching in the App Router compared with Next.js 14?',
	'`fetch` requests are no longer cached by default; you opt in per request with `cache: \'force-cache\'` or a route config.',
	['`fetch` is now cached forever and can only be refreshed with `revalidatePath`.',
	 '`fetch` was removed from Server Components and replaced by the `use` hook.',
	 '`fetch` still caches by default, but only for requests that include an Authorization header, so anonymous requests are never cached while authenticated ones are kept.'],
	'Next.js 14 cached `fetch` results by default (`force-cache`). Next.js 15 flipped this: requests are uncached unless you opt in. The other options invent behavior that does not exist; `fetch` is still fully supported in Server Components.');

add('basic', 'caching',
	'In Next.js 15, what happens to a `GET` Route Handler that uses no dynamic functions?',
	'It is no longer cached by default; you can opt in with `export const dynamic = \'force-static\'`.',
	['It is still prerendered at build time and cached until the next deploy, and is only regenerated when you call revalidatePath from a Server Action.',
	 'It is always cached for 60 seconds, matching the default ISR window.',
	 'It now throws a build error unless it declares a `revalidate` value.'],
	'Next.js 14 treated `GET` handlers without dynamic APIs as static. Next.js 15 changed the default to uncached, so they run on each request. Special metadata routes (sitemap, opengraph-image, icon) remain static by default, and `force-static` brings back the old behavior.',
	`// app/api/time/route.ts
export const dynamic = 'force-static';

export async function GET() {
  return Response.json({ now: Date.now() });
}`);

add('basic', 'caching',
	'What did Next.js 15 change about the client-side Router Cache for Page segments?',
	'The default \`staleTime\` for page segments became 0, so navigations show fresh data from the server.',
	['Pages are now cached on the client for 30 minutes by default.',
	 'The Router Cache was removed entirely, including for back/forward navigation, so every navigation, including going back, always refetches from the server.',
	 'Only layouts are fetched on navigation; page data is never re-requested.'],
	'In Next 14 visited pages were reused from the client cache for 30s (dynamic) or 5 minutes (static). Next 15 sets the page-segment staleTime to 0, while still keeping shared layouts and back/forward restoration cached. `experimental.staleTimes` can restore the old values.');

add('basic', 'cache-components',
	'Which top-level `next.config.ts` option enables the Next.js 16 Cache Components model?',
	'`cacheComponents: true`',
	['`experimental.ppr: true`',
	 '`useCache: true`',
	 '`dynamicIO: true`'],
	'Next.js 16 stabilized the model under a single top-level `cacheComponents` flag. `experimental.ppr`, `experimental.dynamicIO` and `experimental.useCache` were removed or folded into it, so the old flags no longer work in 16.');

add('basic', 'use-cache',
	'Where can the `\'use cache\'` directive be placed?',
	'At the top of a file, or inside an async function or component.',
	['Only at the top of `page.tsx` and `layout.tsx` files.',
	 'Only inside Client Components, because they manage cache state.',
	 'Only inside synchronous helper functions that return plain data.'],
	'`use cache` works at file, component and function level, and cached functions/components must be async. It is a Server-side feature, so it is not limited to pages or to Client Components, and synchronous functions cannot use it.',
	`// lib/data.ts
export async function getProducts() {
  'use cache';
  const res = await fetch('https://api.example.com/products');
  return res.json();
}`);

add('basic', 'use-cache',
	'A `\'use cache\'` function has no `cacheLife` call. Which lifetime applies in Next.js 16?',
	'The `default` profile: revalidate after 15 minutes, 5 minutes client stale time, and no time-based expiry.',
	['It is never cached because a lifetime is required.',
	 'It is cached for 1 second, matching the `seconds` profile.',
	 'It is cached for exactly 1 year, matching the `max` profile.'],
	'Omitting `cacheLife` is allowed and falls back to the `default` profile (stale 5 min, revalidate 15 min, expire never). The docs still recommend setting an explicit lifetime so the behavior is visible at the call site.');

add('basic', 'caching',
	'What is the purpose of `cacheTag` together with `revalidateTag`?',
	'Label cached entries so you can invalidate all entries sharing that tag on demand after a mutation.',
	['Add an HTML data attribute to rendered output for analytics.',
	 'Prevent an entry from being cached when the tag matches a request header, for example to serve different entries to bots and humans.',
	 'Group routes so they are deployed to the same serverless region.'],
	'`cacheTag(\'posts\')` inside a `use cache` scope attaches a tag to that entry. A later `revalidateTag(\'posts\', \'max\')` or `updateTag(\'posts\')` invalidates every entry with that tag, across pages. It has nothing to do with markup, request headers or regions.');

add('basic', 'caching',
	'Where can `updateTag` be called?',
	'Only from Server Actions.',
	['Only from Route Handlers.',
	 'From Server Components during render.',
	 'From Client Components via `import { updateTag } from \'next/cache\'`.'],
	'`updateTag` is Server-Actions-only: it expires the tag and lets the same request read fresh data (read-your-own-writes). Calling it from a Route Handler throws; webhooks should use `revalidateTag(tag, { expire: 0 })` instead. Invalidation during render is also not allowed.');

add('basic', 'caching',
	'In Next.js 16, which call is the recommended stale-while-revalidate form of tag invalidation?',
	'`revalidateTag(\'posts\', \'max\')`',
	['`revalidateTag(\'posts\')` with no second argument',
	 '`revalidateTag(\'posts\', false)`',
	 '`revalidatePath(\'posts\', \'tag\')`'],
	'Next 16 expects a profile as the second argument (`\'max\'` recommended) to get SWR behavior. The single-argument form is deprecated and behaves like `{ expire: 0 }`. `false` is not a valid profile and `revalidatePath` takes a path and `\'page\' | \'layout\'`, not tags.',
	`// app/actions.ts
'use server';
import { revalidateTag } from 'next/cache';

export async function publish() {
  await savePost();
  revalidateTag('posts', 'max');
}`);

add('basic', 'proxy',
	'What replaces `middleware.ts` in Next.js 16?',
	'`proxy.ts`, exporting a function named `proxy` (or a default export).',
	['`gateway.ts`, exporting a function named `gateway`.',
	 '`middleware.node.ts`, which is the same file with a runtime suffix, which is the same file with a runtime suffix and the same function name.',
	 '`route.ts` at the project root, exporting `ALL`.'],
	'Next.js 16 renamed the convention to `proxy` to make the network boundary clearer. A codemod (`npx @next/codemod@canary middleware-to-proxy .`) renames the file and the exported function; the logic stays the same.');

add('basic', 'proxy',
	'Which runtime does `proxy.ts` use in Next.js 16?',
	'The Node.js runtime; the `runtime` option is not available and setting it throws.',
	['The Edge runtime only.',
	 'Edge by default, switchable with `export const runtime = \'nodejs\'`, and the Edge build is then used for static pages only.',
	 'Whichever runtime the page being requested uses.'],
	'Proxy runs on Node.js and the runtime cannot be configured. If you still need Edge, keep using the deprecated `middleware.ts`. That is why Node-only auth or session libraries now work in Proxy.');

add('basic', 'actions',
	'How should you think about a Server Action exported from a `\'use server\'` file?',
	'As a public HTTP endpoint that must do its own authentication and authorization.',
	['As a private function that only your own UI can invoke.',
	 'As an internal function protected by the page that renders its form.',
	 'As a function that is safe as long as its arguments are typed in TypeScript, because the runtime checks the declared types on every call.'],
	'Next.js creates unguessable action IDs and removes unused actions, but an action that is reachable can still be invoked with a hand-crafted POST. Page-level checks do not protect it, and TypeScript types vanish at runtime, so verify the session and validate input inside the action.');

add('mid', 'actions',
	'A Server Action is passed to `useActionState`. How does its signature change compared with using it directly as `<form action>`?',
	'It receives the previous state as a new first argument, followed by the `FormData`.',
	['It receives only the `FormData`, and the previous state is available through `this`.',
	 'It receives the `FormData` first and the previous state second.',
	 'It must be declared with no parameters and read the form through `document.forms`.'],
	'`useActionState` calls your action as `(prevState, formData)`, so the previous result (or `initialState` on the first call) comes first. Without the hook, a `<form action>` function gets just `(formData)`. Forgetting the extra leading parameter is the classic bug that makes `formData.get(...)` fail on the previous state object.',
	`// app/actions.ts
'use server';

export async function signup(prevState: { error?: string } | undefined, formData: FormData) {
  const email = formData.get('email');
  if (typeof email !== 'string' || !email.includes('@')) return { error: 'Invalid email' };
  return {};
}`);

add('basic', 'actions',
	'Where must `useFormStatus` be called to read the pending state of a form?',
	'In a component rendered inside the `<form>` element.',
	['In the same component that renders the `<form>`, because the hook reads the status of the own form of the component.',
	 'In a Server Component above the form.',
	 'In a `useEffect` after the form is submitted.'],
	'`useFormStatus` reads the status of the nearest parent `<form>`, so it returns nothing useful if called in the component that renders the form itself. A typical pattern is a `SubmitButton` child component marked `\'use client\'`.');

add('basic', 'rendering',
	'In Next.js 15 (without Cache Components), which of these makes a route render dynamically at request time?',
	'Reading `cookies()` or `headers()` in the route.',
	['Importing a Client Component, which forces the whole route to render dynamically on the server.',
	 'Using `generateStaticParams`.',
	 'Rendering a `<Link>`.'],
	'Request-time APIs such as `cookies()`, `headers()`, `searchParams` and `connection()` opt the route into dynamic rendering. Client Components, static params and links do not. With Cache Components in 16, the same APIs instead stream behind `<Suspense>` without making the whole route dynamic.');

add('basic', 'rendering',
	'What does `generateStaticParams` do in a dynamic route like `app/blog/[slug]/page.tsx`?',
	'Returns the param values to prerender at build time.',
	['Validates `params` and rejects invalid slugs at request time.',
	 'Converts the route to a client-rendered page.',
	 'Registers the route in the sitemap automatically.'],
	'The function returns an array like `[{ slug: \'a\' }]` and Next.js prerenders those pages during the build. Other values are rendered on demand unless `dynamicParams` is `false`. It does not validate input, change where code runs, or generate a sitemap.');

add('basic', 'rendering',
	'What does `export const dynamicParams = false` do?',
	'Params not returned by `generateStaticParams` respond with a 404 instead of being rendered on demand.',
	['All params are re-rendered on every request.',
	 'The route can no longer receive `params` as a prop.',
	 'Static params are removed and the route becomes fully dynamic, so every path is rendered on demand without being stored afterward.'],
	'With the default `true`, unknown params render on demand and are then cached. Setting `false` limits the route to the prebuilt set and returns 404 for everything else.');

add('basic', 'rendering',
	'How do you make a page use time-based Incremental Static Regeneration every 60 seconds (without Cache Components)?',
	'`export const revalidate = 60;` in the page or layout.',
	['`export const cache = 60;`',
	 '`export const dynamic = \'isr\';`',
	 'Call `setInterval(revalidatePath, 60000)` in the page.'],
	'The `revalidate` route segment config sets the regeneration window in seconds: after it elapses the next request gets the stale page while a fresh one builds in the background. `cache` and `dynamic = \'isr\'` do not exist, and you cannot run timers in a render. Under Cache Components, use `cacheLife` instead.');

add('basic', 'rendering',
	'What is `after()` from `next/server` for?',
	'Scheduling work, like logging or analytics, to run after the response has finished streaming.',
	['Delaying the response until a promise resolves.',
	 'Running code after hydration in the browser.',
	 'Retrying a failed Server Action after a delay.'],
	'`after` (stable since Next.js 15.1) takes a callback that runs once the response (or prerender) is done, so secondary work does not block the user. It runs on the server, not the browser, and it does not delay the response.');

add('basic', 'auth',
	'Where can `cookies().set(...)` be used to write a cookie in the App Router?',
	'In Server Actions and Route Handlers.',
	['In any Server Component while rendering.',
	 'In `layout.tsx` only, before `children` render.',
	 'Anywhere, because Next.js buffers cookie writes until the response ends.'],
	'Headers have already started streaming by the time a Server Component renders, so Next.js forbids setting cookies during render. Mutations belong in Server Actions or Route Handlers (or in Proxy via the response object).');

add('basic', 'perf',
	'What is the role of `instrumentation.ts` in a Next.js app?',
	'Exports a `register()` function that runs once on server start, used to initialize observability such as OpenTelemetry.',
	['Defines client-side analytics events sent on route changes.',
	 'Lists the routes that should be excluded from the static build.',
	 'Configures which components the React Compiler should skip.'],
	'`instrumentation.ts` at the project root (or in `src/`) is stable since Next.js 15. `register()` runs once per server instance, and an optional `onRequestError` hook receives server errors for tools like Sentry.',
	`// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }
}`);

add('basic', 'perf',
	'What is `ImageResponse` from `next/og` used for?',
	'Generating images such as Open Graph cards from JSX and CSS, typically in `opengraph-image.tsx` or a Route Handler.',
	['Optimizing and resizing images that were uploaded by users.',
	 'Rendering `<Image>` components on the server for faster LCP.',
	 'Converting SVG files into React components at build time.'],
	'`ImageResponse` renders a subset of HTML/CSS to a PNG (through Satori) at request or build time. It is not the optimizer behind `next/image`, and it does not transform SVG imports.',
	`// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default function Image() {
  return new ImageResponse(<div style={{ fontSize: 96 }}>Hello</div>);
}`);

add('basic', 'perf',
	'How do you turn on the React Compiler in Next.js 16?',
	'Set `reactCompiler: true` in `next.config.ts` and install `babel-plugin-react-compiler`.',
	['It is always on in Next.js 16 and cannot be disabled, so the option exists only to switch it off in specific files.',
	 'Add `\'use memo\'` to the top of every component file.',
	 'Wrap the root layout in `<ReactCompilerProvider>`.'],
	'Support became stable in 16 as a top-level `reactCompiler` option, but it is off by default because it relies on Babel and slows builds. There is no provider or file-level memo directive required.');

add('basic', 'perf',
	'What is the default bundler in Next.js 16?',
	'Turbopack, for both `next dev` and `next build`; opt out with `--webpack`.',
	['Webpack for builds and Turbopack only for development, while production CSS keeps using the legacy loader.',
	 'Rspack, with Webpack available through a plugin.',
	 'esbuild, with Turbopack used only for CSS.'],
	'Turbopack is stable and the default for dev and production builds in Next.js 16. If a project has a custom `webpack` config, `next build` fails to avoid silently ignoring it, so either migrate it, pass `--turbopack`, or use `--webpack`.');

add('basic', 'migration',
	'In Next.js 16, how must you read `params` in a page and `cookies()` in a Server Component?',
	'Asynchronously: `await props.params` and `await cookies()`.',
	['Synchronously, as in Next.js 13.',
	 'Synchronously, but only in dynamic routes.',
	 'Through `useParams()` and `useCookies()` hooks in Server Components.'],
	'Next.js 15 made these request APIs async with temporary synchronous compatibility. Next.js 16 removed synchronous access entirely. The codemod `next-async-request-api` migrates most call sites, and `next typegen` provides the `PageProps` helper types.',
	`// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  return <h1>{slug}</h1>;
}`);

add('basic', 'migration',
	'What happened to the `next lint` command in Next.js 16?',
	'It was removed; run ESLint or Biome directly, and `next build` no longer lints.',
	['It now runs automatically before every `next dev` start, and it blocks the dev server until ESLint finishes without errors.',
	 'It was renamed to `next check` and also type-checks.',
	 'It is unchanged and still runs from `next build`.'],
	'Linting was decoupled from the framework in 16. A codemod, `next-lint-to-eslint-cli`, migrates scripts to the ESLint CLI. The `eslint` option in the Next config was removed too.');

add('basic', 'security',
	'What is the default maximum request body size for a Server Action?',
	'1 MB, configurable with `bodySizeLimit` under `experimental.serverActions`.',
	['10 MB, configurable per action with a decorator.',
	 'Unlimited, because actions use streaming uploads, because every file upload is streamed to disk without limits.',
	 '100 KB, which cannot be changed.'],
	'The 1 MB default protects against oversized payloads. Raise it with `experimental.serverActions.bodySizeLimit` (for example `\'3mb\'`), keeping in mind multipart overhead on file uploads.');

// ───────────────────────── Mid ─────────────────────────

add('mid', 'use-cache',
	'What is part of the cache key of a `\'use cache\'` function in Next.js 16?',
	'The build ID, a hash of the function, its serializable arguments, and any outer-scope variables it closes over.',
	['Only the function name, so different arguments share one entry.',
	 'The incoming request URL and headers, hashed automatically.',
	 'The current user\'s session cookie, added by the compiler.'],
	'Arguments and closed-over variables are serialized into the key, so different inputs get separate entries. Request headers and cookies are not part of the key because they cannot be read inside the scope at all; pass values you need as arguments instead.',
	`// app/lib/data.ts
export async function getUser(id: string) {
  'use cache';
  // key = build id + function id + id
  return db.user.findUnique({ where: { id } });
}`);

add('mid', 'use-cache',
	'What happens if a `\'use cache\'` function calls `cookies()` directly?',
	'It fails with a `next-request-in-use-cache` error; read the cookie outside and pass the value in as an argument.',
	['It works, and the cookie value becomes part of the cache key automatically, and the compiler warns about it only when a custom cache handler is installed.',
	 'It works but disables caching for that function only.',
	 'It returns an empty cookie store to keep the output deterministic.'],
	'Runtime APIs like `cookies()`, `headers()` and `searchParams` are not available in cached scopes, including through helpers called from them. The preferred pattern is to read them in an uncached component and pass the extracted value as an argument. `use cache: private` exists for the rare cases where this refactor is not possible.',
	`async function Profile() {
  const session = (await cookies()).get('session')?.value;
  return <CachedProfile sessionId={session} />;
}

async function CachedProfile({ sessionId }: { sessionId?: string }) {
  'use cache';
  return <div>{await loadProfile(sessionId)}</div>;
}`);

add('mid', 'use-cache',
	'Which argument types can a `\'use cache\'` function safely accept?',
	'Primitives, plain objects, arrays, Dates, Maps and Sets; non-serializable values such as functions or `children` only as pass-through.',
	['Any value, including class instances, because they are serialized with `JSON.stringify`.',
	 'Only strings and numbers; objects always throw.',
	 'Any value as long as it is frozen with `Object.freeze`.'],
	'Arguments use React Server Components serialization, which is stricter than JSON. Class instances, symbols and `URL` objects are rejected. You can pass JSX or Server Actions through as long as the cached body never reads them, which is how `children` composition works.');

add('mid', 'use-cache',
	'A cached layout renders `{children}` where `children` is a dynamic component. What happens to the dynamic child?',
	'It passes through untouched and is not part of the cached entry, as long as the layout body does not read it.',
	['It is frozen into the cache and becomes static too.',
	 'It throws, because dynamic children cannot be rendered inside cached components, since only fully static elements can be passed through as slots at all.',
	 'It forces the layout to skip caching.'],
	'Compositional slots like `children` are opaque pass-through values. The cached output contains a placeholder for the slot, which is filled at request time. Only if the cached function inspects or modifies `children` does it become part of the key.',
	`// app/layout.tsx
'use cache';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <div className="shell">{children}</div>;
}`);

add('mid', 'use-cache',
	'What does file-level `\'use cache\'` at the top of `lib/reports.ts` imply?',
	'Every exported function in that file is cached, and each one must be async.',
	['Only the default export is cached.',
	 'Only exported functions whose names start with `get` are cached.',
	 'The file is bundled for the client and results are cached in the browser, and the output is kept in browser memory only.'],
	'The directive at module level applies to all exports. Exports that are not async functions cause an error, which also applies to framework exports such as `generateMetadata` in the same file.');

add('mid', 'cache-components',
	'With `cacheComponents: true`, a component awaits an uncached `fetch` and is not wrapped in `<Suspense>` and not cached. What happens?',
	'Next.js reports a blocking-route error during prerender; wrap it in `<Suspense>` or cache it with `use cache`.',
	['The route silently becomes fully dynamic with no warning.',
	 'The fetch result is cached automatically for 15 minutes.',
	 'The build passes and the component renders as an empty string.'],
	'Under Cache Components all code runs at request time unless cached, but Next.js must be able to prerender a static shell. Uncached data or runtime APIs outside a Suspense boundary block that shell, so the build fails with guidance instead of silently going dynamic.',
	`export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LatestPosts />
    </Suspense>
  );
}`);

add('mid', 'cache-components',
	'Under Cache Components, how do you get a value like `crypto.randomUUID()` that is unique per request?',
	'Call `await connection()` before it and render the component inside `<Suspense>`.',
	['Mark the component `\'use cache\'` so it re-runs each request.',
	 'Wrap the call in `unstable_noStore()` inside a Client Component, then export a matching revalidate of zero from the page.',
	 'Export `const revalidate = 0` from the layout.'],
	'`connection()` defers work to request time, so the random value is not baked into the static shell. Caching the component instead shares one value between users until revalidation. `revalidate` segment configs are not the Cache Components way to express this.',
	`import { connection } from 'next/server';

async function RequestId() {
  await connection();
  return <p>{crypto.randomUUID()}</p>;
}`);

add('mid', 'cache-components',
	'In the Cache Components model, how are a prerendered static shell and dynamic content combined on one route?',
	'Static and cached content is prerendered into the shell, while uncached or request-time content streams in behind `<Suspense>` fallbacks.',
	['The whole route must be either static or dynamic; Suspense only affects loading UI.',
	 'Dynamic content is rendered on the client after hydration, outside the server.',
	 'The shell is built per user at request time, then cached in the browser only.'],
	'This is Partial Prerendering as the default under Cache Components: one response starts with a CDN-friendly static shell, and holes marked by Suspense boundaries stream in. Dynamic parts still render on the server; they are not pushed to the client.');

add('mid', 'cache-components',
	'Which statement about `cacheLife(\'seconds\')` and prerendering is correct?',
	'Its expire is under 5 minutes, so the entry is excluded from prerenders and becomes a request-time hole.',
	['It makes the content part of the static shell, refreshed every second at build time, and a separate cron job rebuilds the shell on a schedule.',
	 'It is invalid; `cacheLife` profiles must be at least one minute.',
	 'It disables the client router cache for the whole app.'],
	'Entries with a zero revalidate, an expire under 5 minutes, or a stale under 30 seconds are excluded from prerenders. Of the presets only `seconds` crosses that line. Wrap such content in `<Suspense>` so the fallback ships in the shell.');

add('mid', 'cache-components',
	'What minimum client-side stale time does the router enforce for cache entries from `cacheLife`?',
	'30 seconds, so prefetched links remain usable until the user clicks.',
	['0 seconds, so every navigation refetches, and prefetched layouts are discarded the moment they are received.',
	 '5 minutes, regardless of configuration.',
	 '24 hours, matching static assets.'],
	'The `stale` value is communicated through the `x-nextjs-stale-time` header, and the client enforces at least 30 seconds so a prefetch cannot expire before the click. Calling a revalidation function from a Server Action clears the client cache immediately regardless of this window.');

add('mid', 'use-cache',
	'You deploy to a serverless platform and use plain `\'use cache\'` with the default handler. What should you expect at runtime?',
	'Entries usually do not persist between requests, because instances are ephemeral; `use cache: remote` is the durable option.',
	['Entries are shared globally by the platform and live until you revalidate.',
	 'Caching is disabled entirely in production.',
	 'Entries persist across deploys because the key excludes the build ID.'],
	'The default in-memory LRU handler is per instance, so serverless instances often start cold. Build-time caching still works. The key includes the build (or deployment) ID, so entries do not survive a new deploy even with remote handlers.');

add('mid', 'caching',
	'A Route Handler receives a webhook from your CMS and must invalidate tagged content immediately with no stale reads. What should it call in Next.js 16?',
	'`revalidateTag(tag, { expire: 0 })`',
	['`updateTag(tag)`',
	 '`refresh()`',
	 '`revalidateTag(tag, \'max\')` together with a call to `refresh()` in the same action'],
	'`updateTag` and `refresh` work only in Server Actions. Profile `\'max\'` serves stale content while revalidating in the background, which is the opposite of what the question asks. Passing `{ expire: 0 }` makes the next request a blocking cache miss.',
	`// app/api/cms-webhook/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { tag } = await req.json();
  revalidateTag(tag, { expire: 0 });
  return Response.json({ ok: true });
}`);

add('mid', 'caching',
	'What does `refresh()` from `next/cache` do in a Server Action?',
	'Refreshes uncached data on the current page without touching the cache.',
	['Expires every cache entry in the application.',
	 'Re-runs `generateStaticParams` for the current route.',
	 'Reloads the browser tab with a full document navigation, dropping every cached entry on the server side as well.'],
	'`refresh()` is the server-side counterpart to `router.refresh()`, intended for data that is not cached, such as a live notification count. Cached shells stay intact; to expire cached data use `updateTag` or `revalidateTag`.');

add('mid', 'caching',
	'What is the key difference between `updateTag` and `revalidateTag(tag, \'max\')`?',
	'`updateTag` expires the entry so the next read waits for fresh data, while `revalidateTag` with `max` serves stale content while it refreshes in the background.',
	['`updateTag` works for paths and `revalidateTag` works for tags.',
	 '`updateTag` is asynchronous and returns a promise; `revalidateTag` is synchronous.',
	 '`updateTag` invalidates only the current user\'s cache entries.'],
	'`updateTag` gives read-your-own-writes semantics in Server Actions: the user who just saved sees their change immediately. `revalidateTag` with `max` favors speed with eventual consistency. Neither is path-based or per-user, and both return void.');

add('mid', 'caching',
	'Which call correctly revalidates every page rendered by `app/blog/[slug]/page.tsx`?',
	'`revalidatePath(\'/blog/[slug]\', \'page\')`',
	['`revalidatePath(\'/blog/[slug]\')`',
	 '`revalidatePath(\'/blog\', \'tag\')`',
	 '`revalidatePath(\'/blog/[slug]/page\')` with the type omitted'],
	'When the path contains a dynamic segment you must pass the type, `\'page\'` or `\'layout\'`. Do not append `/page`, and `\'tag\'` is not a valid type. For one concrete URL, use a literal path like `/blog/post-1` without a type.');

add('mid', 'caching',
	'After `revalidatePath(\'/blog\')`, another page `/dashboard` reads the same data through a tagged fetch. What will `/dashboard` show?',
	'Possibly stale data, because the path call does not invalidate the tag used by other pages.',
	['Fresh data, because all pages share one cache.',
	 'An error, because two pages cannot share cached data.',
	 'Fresh data only if the pages are in the same route group, because groups share one cache namespace for tagged data.'],
	'`revalidatePath` is scoped to the page or layout at that path. Other pages using the same tag keep serving cached entries until the tag is invalidated, which is why actions often call both `revalidatePath` and `updateTag`.');

add('mid', 'actions',
	'A Server Action validates a form with zod and must show field errors without throwing. What is the idiomatic return shape?',
	'Return a serializable state like `{ errors: { email: [\'Invalid\'] } }` and read it with `useActionState`.',
	['Throw a `ZodError` and catch it in a Client Component with try/catch around the form, so the form can then reset itself afterwards.',
	 'Return the raw `Response` object with status 400.',
	 'Call `notFound()` so the error boundary shows the message.'],
	'Expected validation failures are normal return values, not exceptions: the action returns an error object and `useActionState` re-renders the form with it. Thrown errors hit the nearest error boundary instead, and `notFound()` signals a missing resource.',
	`// app/actions/auth.ts
'use server';
import * as z from 'zod';

const Schema = z.object({ email: z.email() });

export async function signup(_prev: unknown, formData: FormData) {
  const parsed = Schema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }
  // create the user...
}`);

add('mid', 'actions',
	'Why does `<form action={serverAction}>` support progressive enhancement?',
	'The form posts to the server even before JavaScript loads, and hydration then upgrades it to a client-side submission.',
	['Because the action is converted to a `GET` request that browsers prefetch.',
	 'Because Next.js server-renders a fallback `<iframe>` for the form.',
	 'It does not; forms with Server Actions require JavaScript to submit.'],
	'When the action is passed directly to a Server Component form (or via `useActionState` with a permalink), the browser can submit natively with a POST that carries an action ID. After hydration, React intercepts submissions and avoids a full reload.');

add('mid', 'actions',
	'In `useOptimistic` used with a Server Action, what happens if the action fails?',
	'The optimistic value is discarded when the transition ends, so the UI reverts to the real state.',
	['The optimistic value stays until the user refreshes the page.',
	 'React retries the action three times, then keeps the optimistic value, with the retry count configurable in next.config.',
	 'The component unmounts and the nearest `loading.tsx` renders.'],
	'Optimistic state is temporary: it layers over the base state only while the async transition is pending. When the transition settles, the UI shows whatever the real state is, so a failure or an unchanged result naturally rolls the change back.',
	`'use client';
import { useOptimistic, startTransition } from 'react';

export function Likes({ count, like }: { count: number; like: () => Promise<void> }) {
  const [optimistic, add] = useOptimistic(count, (n, d: number) => n + d);
  return (
    <button onClick={() => startTransition(async () => { add(1); await like(); })}>
      {optimistic}
    </button>
  );
}`);

add('mid', 'actions',
	'An inline Server Action closes over a variable defined in the surrounding Server Component. How does Next.js protect that captured value?',
	'It encrypts closed-over variables with a per-build key before sending them to the client and decrypts them on invocation.',
	['They are never sent to the client; they stay in server memory between requests.',
	 'They are sent in plain JSON because the action runs on the server.',
	 'They are signed but not encrypted, so the client can read them.'],
	'Captured values travel to the client and back so the action can use the snapshot taken at render time. Next.js encrypts them, with a key generated per build and per action, so actions only work for the build that created them. The docs still warn not to rely on encryption alone for secrets.');

add('mid', 'actions',
	'You self-host the same Next.js build on several servers behind a load balancer and some Server Action calls fail to decrypt. What is the fix?',
	'Set the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` on every instance.',
	['Disable the action ID encryption in `next.config.ts`.',
	 'Set `serverActions.allowedOrigins` to the load balancer address, because the origin check cannot see forwarded headers.',
	 'Enable sticky sessions and remove `use server` from closures.'],
	'Each build normally generates its own keys. If separate instances produce different keys, an action created on one fails on another. A persistent base64 AES key set through the environment makes all instances agree. `allowedOrigins` deals with the CSRF Origin check, a different failure.');

add('mid', 'security',
	'What does the built-in CSRF protection for Server Actions compare?',
	'The `Origin` header against the `Host` or `X-Forwarded-Host` header, aborting if they differ.',
	['A CSRF token stored in a cookie against one in a hidden field, rejecting requests where the two values differ by even one byte.',
	 'The `Referer` header against a list in `robots.txt`.',
	 'The client IP address against the one that loaded the page.'],
	'Actions are POST-only, which with default `SameSite` cookies blocks most CSRF. Next.js adds an Origin/Host comparison, and `serverActions.allowedOrigins` lists extra safe hosts for setups with reverse proxies. There is no automatic token or IP check.');

add('mid', 'security',
	'A reverse proxy rewrites the host, and Server Actions fail with an origin mismatch in production. What is the recommended configuration?',
	'Add the public host to `experimental.serverActions.allowedOrigins`, or make the proxy forward the correct `x-forwarded-host`.',
	['Disable CSRF protection by setting `serverActions.csrf: false`.',
	 'Move the actions into API Route Handlers.',
	 'Change all actions from POST to GET.'],
	'The Origin header carries the host in the browser address bar. If the server sees a different host, the request is rejected. Allow-listing the origin (wildcards like `*.example.com` are supported) or forwarding the right host fixes it without weakening the check. There is no `csrf: false` switch and actions can only be invoked via POST.');

add('mid', 'auth',
	'What is the recommended role of `proxy.ts` in authentication?',
	'Cheap optimistic checks, such as reading the session cookie and redirecting; the real authorization stays close to the data.',
	['The only place authorization is needed, since it runs before every route.',
	 'Querying the database for each request to validate sessions.',
	 'Replacing the data access layer so server code can skip auth checks.'],
	'Proxy runs for every matched request, including prefetches, so database lookups there hurt performance. It is a good pre-filter, but pages, actions and route handlers must still verify sessions because proxy can be bypassed by matcher changes or by actions on excluded paths.');

add('mid', 'auth',
	'A page redirects non-admins, and renders a form with an inline Server Action that deletes records. The action has no checks of its own. What is the risk?',
	'Anyone can call the action with a crafted POST, because the page-level check does not protect the action.',
	['None; actions inherit the auth state of the page that rendered them, since Next.js re-verifies the session cookie on every action call.',
	 'Only logged-out users can call it, as the cookie check is automatic.',
	 'The action is blocked because it is defined inline.'],
	'A Server Action is a separate entry point. The docs show re-verifying the session inside the action as critical. Page redirects only control what UI renders.',
	`<form
  action={async () => {
    'use server';
    const session = await auth();
    if (!session?.user?.isAdmin) throw new Error('Unauthorized');
    await db.record.deleteMany();
  }}
>
  <button>Delete</button>
</form>`);

add('mid', 'auth',
	'Why is it risky to do the only auth check in a shared layout?',
	'Layouts do not re-render on navigation between their children, so the check may not run on every route change.',
	['Layouts cannot access cookies or headers.',
	 'Layouts always render before the proxy, so cookies are not set yet.',
	 'Layouts run only at build time and never see the request.'],
	'Because of partial rendering, a layout persists across navigations in its segment, so its check is not repeated for each page. Checks belong in the data access layer or near the data/UI that needs them. Layouts can read cookies; they simply are not a reliable gate.');

add('mid', 'auth',
	'What does a data access layer (DAL) with `import \'server-only\'` give you?',
	'A central, server-only place for auth checks and DTO shaping, and a build error if client code imports it.',
	['Automatic row-level security in your database.',
	 'Encrypted cookies without a session library.',
	 'Caching of every query for 15 minutes.'],
	'The `server-only` import makes bundling the module into a Client Component fail the build, so secrets and queries cannot leak. Centralizing verification and returning minimal DTOs makes consistent authorization easier. It does not add database features, session encryption, or caching.');

add('mid', 'auth',
	'How do you enable and use `forbidden()` from `next/navigation` (Next.js 15.1+)?',
	'Enable the experimental `authInterrupts` option, call `forbidden()` to render a 403 UI, and customize it with `forbidden.tsx`.',
	['Import it and call it; it works in every project without configuration.',
	 'Return `new Response(null, { status: 403 })` from the page component.',
	 'Throw `new Error(\'403\')` and Next.js maps it to the status.'],
	'`forbidden()` and `unauthorized()` are experimental and require `experimental.authInterrupts: true`. They throw a special error, so you should not wrap them in a `try/catch` that swallows it, and the call cannot be used in the root layout.');

add('mid', 'proxy',
	'`proxy.ts` has no `config.matcher`. Which requests does it run on?',
	'Every request, including `_next/static`, `_next/image` and files from `public/`.',
	['Only page requests that match a route file, such as pages and layouts, but never assets or API routes.',
	 'Only requests under `/api`.',
	 'None, because a matcher is mandatory.'],
	'Without a matcher Proxy executes for all requests, so auth redirects can accidentally block CSS, JS or images. A negative lookahead regex is the standard way to exclude assets.',
	`// proxy.ts
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};`);

add('mid', 'proxy',
	'You exclude `/dashboard/api` from the proxy matcher. What is the consequence for Server Actions used on a page at that path?',
	'Server Action calls are POSTs to the page route, so Proxy does not run for them either; they must verify auth themselves.',
	['Nothing; Server Actions are routed through a separate internal path that proxy always sees, so excluding a path in the matcher never affects their execution.',
	 'Actions are blocked by default until included in the matcher.',
	 'Proxy still runs because it hooks into all POST requests.'],
	'Server Functions are not a separate route in the proxy execution chain. A matcher change or moving an action to another route can silently remove coverage, so the docs advise verifying authentication and authorization inside every action.');

add('mid', 'proxy',
	'You have middleware that must remain on the Edge runtime in Next.js 16. What should you do?',
	'Keep `middleware.ts` (deprecated but supported for Edge) since `proxy.ts` is Node.js only.',
	['Rename it to `proxy.ts` and set `export const runtime = \'edge\'`.',
	 'Move the logic into `layout.tsx` using `export const runtime = \'edge\'`, which is the supported way to keep Edge in Next.js 16.',
	 'Remove it; Edge runtime is not supported anywhere in Next.js 16.'],
	'The upgrade guide says `edge` is not supported in `proxy` and its runtime cannot be configured; Edge middleware keeps working under the old filename while deprecated. Setting `runtime` in a proxy file throws an error.');

add('mid', 'rendering',
	'Which route config is no longer the way to express rendering mode once `cacheComponents` is on?',
	'`export const experimental_ppr`, which was removed along with `experimental.ppr`.',
	['`export default async function Page()`',
	 '`<Suspense fallback>`',
	 '`generateStaticParams`'],
	'Cache Components makes PPR the default behavior, so the route-level `experimental_ppr` export and the config flag are gone. Suspense, async components and `generateStaticParams` all remain central to the model.');

add('mid', 'rendering',
	'Which statement about `<Suspense>` under Cache Components is accurate?',
	'It provides a fallback while async work streams in, but it does not itself make a component dynamic.',
	['It makes any child render only at request time.',
	 'It caches the child output for 15 minutes.',
	 'It is required around every synchronous component.'],
	'A component that only does synchronous work completes during prerender whether or not it is in Suspense. Suspense matters when the component awaits uncached or runtime data, so its fallback can be part of the static shell.');

add('mid', 'deploy',
	'What does `output: \'standalone\'` do when building for Docker?',
	'Produces a minimal server in `.next/standalone` with only the traced dependencies, started with `node server.js`.',
	['Exports a fully static site into the `out` folder.',
	 'Bundles all dependencies into a single browser file.',
	 'Disables server components so the app can run on any CDN.'],
	'Standalone output copies just the files needed by the server (via output file tracing), which makes small images. You still copy `public` and `.next/static` yourself. Static export is `output: \'export\'`, which does not support Server Actions, Proxy or `use cache`.');

add('mid', 'deploy',
	'Which statement about static export (`output: \'export\'`) is correct for Next.js 16?',
	'Features that need a server, such as Server Actions, Proxy, `use cache`, and `after`, are not supported.',
	['All App Router features work because export bundles a Node.js server, so every feature keeps working on any static file host.',
	 'Only Server Actions are unsupported; everything else works.',
	 'It is required to use Cache Components.'],
	'Static export produces HTML, CSS and JS that any static host can serve, so server-dependent APIs listed in the docs\' platform support tables show "No" for it. Cache Components needs the Node.js runtime.');

add('mid', 'perf',
	'What is `optimizePackageImports` in `next.config.ts` for?',
	'Making imports from large barrel packages load only the modules used, improving dev speed and bundle size.',
	['Preloading listed packages at build time into the HTML head.',
	 'Moving selected packages from `dependencies` to `devDependencies`, which shrinks the install size of production servers by about half.',
	 'Forcing packages to run on the Edge runtime.'],
	'Barrel files (`import { Icon } from \'lib\'`) can pull in thousands of modules. The option tells Next.js to rewrite those imports to direct paths. Popular libraries like `lucide-react` and `date-fns` are optimized by default.',
	`// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@acme/ui', 'lodash-es'],
  },
};
export default nextConfig;`);

add('mid', 'perf',
	'How do you report Core Web Vitals from the App Router to your own endpoint?',
	'Use `useReportWebVitals` from `next/web-vitals` inside a Client Component.',
	['Export `reportWebVitals` from `pages/_app.tsx`.',
	 'Call `performance.getEntries()` in `layout.tsx` on the server, where browser metrics are collected on the server.',
	 'Enable `webVitals: true` in `next.config.ts`.'],
	'The hook receives metric objects (LCP, CLS, INP and so on) and can send them with `navigator.sendBeacon`. The `_app` export is Pages Router, and layouts run on the server where browser metrics do not exist.',
	`'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
  });
  return null;
}`);

add('mid', 'security',
	'You need a nonce-based Content Security Policy in the App Router. What does that imply?',
	'Pages must be rendered dynamically so a fresh nonce can be set per request, typically generated in Proxy.',
	['Nonces work with fully static pages because Next.js rewrites them at build time, because the HTML is rewritten with a fresh nonce for each visitor.',
	 'You must disable React hydration for nonce support.',
	 'Nonces are set in `next.config.ts` and apply to all deployments.'],
	'A nonce must be unique per response, so statically prerendered HTML (served identically to everyone) cannot carry it. The documented approach generates a nonce in Proxy, adds it to request and response headers, and lets Next.js apply it to its scripts.');

add('mid', 'security',
	'What does React\'s `experimental_taintObjectReference` protect against?',
	'Accidentally passing a sensitive server object to a Client Component; React throws instead of serializing it.',
	['SQL injection in queries built from user input.',
	 'Cross-site scripting through `dangerouslySetInnerHTML`.',
	 'Leaking environment variables in the server console.'],
	'Taint APIs (enabled with `experimental.taint`) add a last line of defense in the render boundary. The docs stress it is an extra layer: still sanitize in the DAL and return DTOs.');

add('mid', 'testing',
	'What is the documented caveat for testing async Server Components?',
	'Jest and Vitest do not support rendering them, so cover them with end-to-end tests such as Playwright.',
	['They cannot be tested at all, even end-to-end.',
	 'They can only be tested after converting them to Client Components.',
	 'They require a special Next.js testing server started with `next test`, which is started with a dedicated command and a separate config file.'],
	'Unit tools can test sync Server Components and Client Components, but async Server Components are not supported by those runners. E2E tests run the real server, so they work. There is no `next test` command.');

add('mid', 'i18n',
	'How is internationalized routing typically done in the App Router?',
	'Put pages under a `[locale]` segment and detect or redirect the locale in `proxy.ts`.',
	['Set `i18n: { locales }` in `next.config.ts`, which the App Router reads like the Pages Router.',
	 'Create one root layout per language in `app/en/layout.tsx` only, with no dynamic segment.',
	 'Wrap every page in `next/i18n` provider.'],
	'The built-in `i18n` config belongs to the Pages Router. In the App Router you implement routing yourself, usually with a `[locale]` dynamic segment, `generateStaticParams` for known locales, and Proxy for negotiation, often with a library such as next-intl.');

add('mid', 'migration',
	'Which command runs the recommended automated upgrade for Next.js 16?',
	'`npx @next/codemod@canary upgrade latest`',
	['`npm run next upgrade --force`',
	 '`npx create-next-app --migrate` and then run the dev server',
	 '`npx next lint --fix`'],
	'The upgrade codemod updates dependencies and applies migrations such as the `turbopack` config location, `middleware` to `proxy`, and removing `unstable_` prefixes. It does not run every codemod, so the async request APIs one (`next-async-request-api`) may still be needed.');

add('mid', 'migration',
	'Which image defaults changed in Next.js 16?',
	'`minimumCacheTTL` became 4 hours, `qualities` defaults to `[75]`, and local IP optimization is blocked by default.',
	['`minimumCacheTTL` became 60 seconds and `qualities` accepts all values.',
	 'Image optimization is disabled by default.',
	 '`domains` became the only supported way to allow remote images.'],
	'The 16 release also reduced `maximumRedirects` to 3 and removed 16 from `imageSizes`. `images.domains` is deprecated in favor of `remotePatterns`. Review `quality` props, since unsupported values are coerced to the nearest allowed one.');

add('mid', 'migration',
	'What must you add to every parallel route slot in Next.js 16?',
	'An explicit `default.js`; the build fails without it.',
	['A `layout.tsx` that renders `null`.',
	 'A `loading.tsx` with a skeleton.',
	 'A matching route in `next.config.ts` `rewrites`, which maps each slot to a matching URL.'],
	'Previously a missing default silently fell back. Now every slot needs `default.js`, which can call `notFound()` or return `null` to keep the old behavior.');

add('mid', 'perf',
	'What does Turbopack file-system caching provide?',
	'Compiler artifacts are stored on disk between runs, speeding up restarts and rebuilds.',
	['A shared network cache for runtime data fetched by Server Components, used to deduplicate runtime data across servers.',
	 'Caching of `fetch` responses across deployments.',
	 'An on-disk cache for `use cache` entries.'],
	'It is a build-tool cache, enabled by default for dev and build in recent versions according to the 16 upgrade guide (it started as `experimental.turbopackFileSystemCacheForDev` in 16.0). It has nothing to do with the application-level cache from `use cache` or `fetch`.');

add('mid', 'security',
	'You want to rate-limit an expensive Server Action. Where should the check run?',
	'Inside the action (or its DAL function), keyed by user or IP, before doing the work.',
	['Only in the Client Component, before calling the action, which is enough because the browser enforces the limit.',
	 'In `next.config.ts` using a `rateLimit` option.',
	 'Not needed, because actions are POST-only.'],
	'Actions are reachable by anyone who can send a POST, so client-side throttling is not a control. Next.js has no built-in rate limiter option; implement it with a store such as Redis in the server path the request hits.');

// ───────────────────────── Advanced ─────────────────────────

add('advanced', 'use-cache',
	'`Page` is marked `\'use cache\'` with no `cacheLife` and renders `<Ticker />`, which uses `\'use cache\'` with `cacheLife(\'seconds\')`. What happens in Next.js 16?',
	'Prerendering fails with an error: a short-lived nested cache under an outer cache with no explicit `cacheLife` is rejected.',
	['The page silently inherits a 1 second lifetime and is still prerendered.',
	 'The inner `cacheLife` is ignored and the page keeps the 15 minute default.',
	 'The page is cached for exactly one year because the outer scope wins.'],
	'Without an explicit outer lifetime, a shorter inner one would propagate and quietly make the whole page short-lived. Next.js throws during prerender to prevent that accident. Fix it by giving the outer scope an explicit `cacheLife`, or wrapping the short-lived part in `<Suspense>`.',
	`// app/page.tsx
'use cache';

export default async function Page() {
  // no cacheLife here
  return <Ticker />; // Ticker: 'use cache' + cacheLife('seconds')
}`);

add('advanced', 'use-cache',
	'An outer `\'use cache\'` component calls `cacheLife(\'hours\')` and contains an inner cached component using `cacheLife(\'minutes\')`. Which lifetime governs the outer entry?',
	'`hours`: an explicit outer `cacheLife` wins, and a hit returns the full output including the nested data.',
	['`minutes`, because the shortest nested lifetime always wins.',
	 'The average of the two lifetimes.',
	 'Neither; nesting `use cache` is not allowed.'],
	'Only an outer scope without `cacheLife` has its lifetime lowered by shorter inner entries. With an explicit value, the outer cache returns its stored result for its whole lifetime. That is also why explicit lifetimes are recommended: the behavior can be read at the call site.');

add('advanced', 'use-cache',
	'A `Dynamic` component calls `const store = cookies()` without `await` and passes `store` to `<Cached promise={store} />`, which uses `\'use cache\'` and awaits the prop. What is the symptom?',
	'The build hangs until the roughly 50 second "filling a cache during prerender timed out" error.',
	['A type error at compile time that prevents the build.',
	 'The cookie value is cached and shared between all users.',
	 'The cache entry is skipped silently and the component renders every request, so the user sees the stale content without any error.'],
	'The promise resolves only with request data, which does not exist at prerender, so the cache fill waits until it times out. The fix is to await the runtime value outside and pass the plain string. Directly calling `cookies()` inside the cached scope fails faster with a different error.');

add('advanced', 'use-cache',
	'A parent component stores data in a `React.cache` helper and a child marked `\'use cache\'` reads the same helper. What does the child see?',
	'An empty store: `React.cache` has an isolated scope inside `use cache` boundaries.',
	['The parent\'s value, since `React.cache` is per request.',
	 'The value from the previous request, as cache entries persist, and are keyed only by the function id.',
	 'It throws because `React.cache` cannot be called there.'],
	'Cached functions run in an isolated environment so the output depends only on arguments and closures. Values set through `React.cache` outside are invisible inside; pass data in as arguments instead.');

add('advanced', 'use-cache',
	'When is `\'use cache: private\'` the right tool?',
	'When compliance or legacy code forces a cached function to read `cookies()`, `headers()` or `searchParams` directly, with results kept only in the browser.',
	['When you want the cache stored in a shared Redis instance across servers.',
	 'When the result must be cached on the CDN for all visitors.',
	 'When you want caching to be skipped in production.'],
	'`private` executes on the server, can read runtime data, and stores the result only in the browser for the `stale` window. Shared durable storage is `use cache: remote`. The docs call private rare: the preferred pattern is extracting values and passing them as arguments.');

add('advanced', 'use-cache',
	'Draft Mode is enabled and a request renders a component containing `\'use cache\'`. What is the behavior?',
	'Cached scopes re-execute on every request and their results are not saved; reading `draftMode().isEnabled` inside is allowed.',
	['The previously cached published content is served so previews do not hit the CMS.',
	 'The request fails because Draft Mode and `use cache` cannot be combined.',
	 'Only `cookies()` and `headers()` become available inside the cached scope.'],
	'This lets previews show fresh draft content without extra caching code. `cookies()` and `headers()` remain forbidden even when Draft Mode is active, and `enable()`/`disable()` cannot be called inside a cache scope.');

add('advanced', 'use-cache',
	'In this code, which values form the cache key of `getData`?',
	'`userId` (captured from the closure) and `filter` (the argument), plus the build ID and function ID.',
	['Only `filter`, because closed-over values are not tracked.',
	 'Only `userId`, because arguments are ignored when a closure exists, and the build ID is then used as the only other key part.',
	 'Neither; the key is derived only from the file path.'],
	'The compiler binds captured outer-scope variables as hidden arguments, so they participate in the key just like explicit parameters. Different user and filter combinations therefore produce separate entries.',
	`async function Component({ userId }: { userId: string }) {
  const getData = async (filter: string) => {
    'use cache';
    const res = await fetch(\`https://api.example.com/users/\${userId}/data?filter=\${filter}\`);
    return res.json();
  };
  return getData('active');
}`);

add('advanced', 'caching',
	'You call `revalidateTag(\'posts\', \'max\')` in a Server Action. When does the revalidation for each page that uses the tag run?',
	'On the next request for that page, which is served stale content while the refresh happens in the background.',
	['Immediately for every page, in parallel, as part of the call.',
	 'At the next deploy, because tags are only evaluated at build time.',
	 'When the page\'s `cacheLife` expires, ignoring the call.'],
	'Calling the function only marks entries stale. A visit triggers the actual regeneration, with stale-while-revalidate semantics up to the profile\'s expire window (about a year for `max`). That is why many pages are not refreshed all at once.');

add('advanced', 'caching',
	'After a Server Action calls `revalidatePath`, `revalidateTag`, `updateTag` or `refresh`, what happens to the client-side router cache?',
	'The whole client cache is cleared immediately, bypassing stale times.',
	['Only the cache entry of the current URL is cleared.',
	 'Nothing; the client cache is only cleared by hard reload, never by Server Actions or route changes.',
	 'It is cleared only if the action returns a redirect.'],
	'Server Action revalidation invalidates the client cache wholesale so that subsequent navigations fetch fresh data. The docs note that for `revalidatePath` this broad refresh is currently temporary behavior and may later be narrowed.');

add('advanced', 'rendering',
	'A page calls `after(async () => { const c = (await cookies()).get(\'id\') })` in a Server Component. What happens?',
	'A runtime error: request APIs cannot be used inside `after` in Server Components, so read them before and close over the values.',
	['It works, and `after` runs inside the request context.',
	 'It makes the route fully dynamic but succeeds.',
	 'It silently returns `undefined` for the cookie.'],
	'Next.js must know which parts of the tree read request data (for PPR and Cache Components), but `after` runs after React\'s render lifecycle. In Route Handlers and Server Actions you can read `cookies()` and `headers()` inside the callback.',
	`// app/page.tsx
export default async function Page() {
  const id = (await cookies()).get('id')?.value;
  after(() => log({ id })); // fine: value read before
  return <h1>Hi</h1>;
}`);

add('advanced', 'rendering',
	'Does the callback passed to `after()` run if the route calls `redirect()` or throws an error?',
	'Yes, it still runs once the response finishes, even on errors, `notFound()` or `redirect()`.',
	['No, it runs only when the response status is 200.',
	 'Only when the route is statically generated.',
	 'Only if you wrap the page in a try/catch.'],
	'`after` is meant for reliable side effects such as logging, so it executes regardless of how the response ended. It also does not make the route dynamic; on a static page it runs at build time or revalidation.');

add('advanced', 'actions',
	'A Server Action wraps `await db.save()` and `redirect(\'/done\')` in a `try { ... } catch { return { error: \'Failed\' } }`. What goes wrong?',
	'`redirect()` works by throwing, so the catch swallows it and the redirect never happens (unless the error is rethrown).',
	['Nothing; `redirect` returns normally and the catch only handles database errors, which is why this pattern is the documented best practice.',
	 'The `catch` block runs, but the redirect still happens afterward.',
	 'TypeScript rejects `redirect` inside `try` blocks.'],
	'`redirect`, `notFound`, `forbidden` and `unauthorized` interrupt rendering by throwing special errors. Call them outside the try block, or use `unstable_rethrow(error)` in the catch before handling real errors.',
	`'use server';
import { redirect } from 'next/navigation';

export async function save(formData: FormData) {
  try {
    await db.save(formData);
  } catch {
    return { error: 'Failed' };
  }
  redirect('/done'); // outside the try
}`);

add('advanced', 'security',
	'A cross-origin POST to a Server Action arrives with no `Origin` header at all. What does Next.js do according to the current docs?',
	'It allows the request through with a warning, instead of rejecting it.',
	['It always rejects the request with a 403.',
	 'It falls back to the `Referer` header and rejects if it differs, and rejects it when the values differ.',
	 'It rewrites the request to the app\'s own host.'],
	'The CSRF mechanism compares Origin with Host. When no Origin is sent, the check cannot run and the docs describe allowing the call with a warning. That is another reason to authenticate and authorize inside each action rather than relying on the Origin check.');

add('advanced', 'security',
	'Your `allowedOrigins` is `[\'*.my-proxy.com\']`. Which request origin host is accepted?',
	'`app.my-proxy.com`; the bare `my-proxy.com` needs its own entry.',
	['`my-proxy.com` and all of its subdomains at any depth, including ones that use a custom port.',
	 '`app.eu.my-proxy.com` only.',
	 '`app.my-proxy.com:8443` with any port.'],
	'A single `*` stands for exactly one host label, so `*.my-proxy.com` does not match the apex domain or deeper subdomains (`**.` at the start does that), and ports must be written out. Entries are compared against the `host` including a non-default port.');

add('advanced', 'proxy',
	'You exclude `_next/data` in a negative matcher. Does Proxy still run for `_next/data` requests?',
	'Yes, intentionally, so protecting a page cannot be bypassed by requesting its data route.',
	['No, excluded paths are never executed.',
	 'Only in development.',
	 'Only if the request has a session cookie.'],
	'Next.js keeps invoking Proxy for `_next/data` even when your matcher excludes it, to avoid the case where you secured a page but forgot its data route.');

add('advanced', 'proxy',
	'In `proxy.ts` you want to forward an extra header to your Server Components, not to the browser. Which call does that?',
	'`NextResponse.next({ request: { headers: newHeaders } })`',
	['`NextResponse.next({ headers: newHeaders })`',
	 '`response.headers.set(\'x-extra\', \'1\')` on the returned response',
	 'Writing to a module-level `Map` keyed by URL.'],
	'The `request` option modifies the headers the upstream route sees. Passing `headers` directly (or setting response headers) sends them to the client. Proxy may be deployed separately from the render code, so shared module state is not reliable.',
	`// proxy.ts
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant', 'acme');
  return NextResponse.next({ request: { headers: requestHeaders } });
}`);

add('advanced', 'cache-components',
	'A layout does `const { slug } = await params` at the top and `params` is dynamic. How can you keep the sidebar in the static shell?',
	'Do not await in the layout body; pass the `params` promise down and await it inside a child wrapped in `<Suspense>`.',
	['Wrap the entire layout in `\'use cache\'`.',
	 'Declare `export const dynamic = \'force-static\'`.',
	 'Move the sidebar into a Client Component.'],
	'Awaiting runtime data high in the tree makes everything below it wait for the request. Pushing the await down means only that child streams behind a fallback while siblings are prerendered. A Client Component would not help since it still renders on the server for the shell, and route segment configs are not the mechanism.');

add('advanced', 'use-cache',
	'What happens if `cacheLife(\'days\')` is called at module scope of a file?',
	'It throws; `cacheLife` must be called inside a cache directive scope, and only one call should run per invocation.',
	['It sets the default for every `use cache` in the file.',
	 'It is ignored in production and used only in development.',
	 'It is hoisted by the compiler into `next.config.ts`.'],
	'`cacheLife` is tied to the scope that executes it. You can call it in different branches (for example, a short life for a missing item and a longer one for published content), but you cannot use it globally. Project-wide values belong in the `cacheLife` profiles in the config.');

add('advanced', 'use-cache',
	'After a new deployment, will `use cache` entries produced by the previous build be reused?',
	'No; the cache key includes the build ID (or `deploymentId`), so entries start fresh, even in remote handlers.',
	['Yes, as long as the function source did not change.',
	 'Yes for `use cache: remote`, no for in-memory.',
	 'Yes, until `cacheLife` expires them.'],
	'Keying on the build or deployment ID guarantees code and cached output stay consistent. For data that must outlive deploys, the docs suggest `unstable_cache` or the `fetch` cache instead.');

add('advanced', 'caching',
	'In Next.js 15, what does `export const dynamic = \'force-dynamic\'` do to `fetch` calls that did not set a cache option?',
	'They default to `no-store`, so nothing from those requests is cached.',
	['They default to `force-cache` with a 60 second revalidate, so pages regenerate every minute on their own.',
	 'They are blocked until a `cache` option is added.',
	 'They run on the Edge runtime.'],
	'Next 15 listed this among its breaking changes: `force-dynamic` now sets a `no-store` default on the fetch cache for that route. It is route-level behavior; fetches with an explicit cache option keep theirs.');

add('advanced', 'caching',
	'In Next.js 15, after the Router Cache change, which client cached item still lives for 5 minutes by default?',
	'`loading.js` (the static shell), controlled by `staleTimes.static`.',
	['Page segments (`page.js`) fetched by navigation, which are cached on the client for five minutes.',
	 'Server Action results.',
	 'Route Handler responses.'],
	'Pages got a staleTime of 0, but shared layout data, back/forward restoration, and `loading.js` remain cached. You can restore old page behavior with `experimental.staleTimes.dynamic`.');

add('advanced', 'cache-components',
	'With `cacheComponents` enabled, what does Next.js do with the previous route when the user navigates away?',
	'It keeps it hidden with React `<Activity>`, preserving its state and cleaning up effects, for a few recent routes.',
	['It unmounts immediately and discards state like before.',
	 'It freezes the component tree and keeps running effects in the background, so state is kept but the page blocks navigation until the effects settle.',
	 'It serializes state into localStorage.'],
	'Hiding preserves form inputs and expanded sections when the user returns, while effects are cleaned up when hidden and recreated on show. Older routes are evicted. Patterns that assumed unmount, like dialogs, may need adjustments.');

add('advanced', 'cache-components',
	'A route sets `export const runtime = \'edge\'` and you enable `cacheComponents`. What is the guidance?',
	'Migrate it to Node.js: Cache Components requires the Node.js runtime.',
	['Nothing; Edge routes work the same way.',
	 'Move the route to `proxy.ts`, which is the supported Edge location, since Proxy also supports the edge runtime.',
	 'Add `use cache: edge` to the route.'],
	'The docs state that Cache Components needs Node.js, and that deprecated edge exports should be migrated. `proxy.ts` is Node.js too, and there is no `edge` cache variant.');

add('advanced', 'caching',
	'What happens if you call `revalidateTag` while rendering a Server Component?',
	'It throws an error (since Next.js 15); invalidation is only allowed from Server Actions and Route Handlers.',
	['It works and the current render uses the refreshed data.',
	 'It queues the invalidation until after the response with `after`.',
	 'It is allowed only if the call is wrapped in `Suspense`.'],
	'Mutations must not be side effects of rendering, because render can be repeated, prefetched or cached. The same rule applies to setting cookies. Use an action or handler.');

add('advanced', 'security',
	'A Server Action returns the full updated database row to show a success message. What is the issue the docs call out?',
	'Return values are serialized to the client, so internal fields can leak; return only what the UI needs.',
	['None; return values never leave the server.',
	 'Return values must be strings, so rows fail to serialize.',
	 'Returning data from an action disables revalidation.'],
	'Action results are part of the response sent to the browser. Treat them like an API payload and return a minimal object such as `{ success: true }`, keeping auth and ownership checks inside the action.');

add('advanced', 'perf',
	'What does the Next.js 16 navigation overhaul do for a page with 50 product links sharing a layout?',
	'The shared layout is downloaded once for all prefetches, and only missing parts are prefetched incrementally.',
	['Each link still downloads the full page, but in parallel.',
	 'Prefetching is disabled when more than 10 links are visible.',
	 'All 50 pages are prefetched in a single combined request.'],
	'Layout deduplication and incremental prefetching reduce transfer size, at the cost of possibly more individual requests. Prefetches are also cancelled when links leave the viewport and prioritized on hover.');

add('advanced', 'deploy',
	'What is the status of the Build Adapters API introduced in Next.js 16 for deployment platforms?',
	'Alpha at 16.0 via `experimental.adapterPath`; promoted to a stable top-level `adapterPath` in 16.2.',
	['Stable since 15.0 as `output: \'adapter\'`.',
	 'Removed in 16 in favor of Docker-only deployment.',
	 'A Vercel-only API that cannot be used by other platforms.'],
	'Adapters let platforms modify config or process build output. The upgrade guide notes the promotion in 16.2.0. Self-hosting, Docker and adapters are listed as supported deployment options for features like `use cache`.');

export const nextQuestionsB = out;
