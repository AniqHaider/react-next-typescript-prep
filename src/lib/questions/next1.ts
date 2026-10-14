import { builder } from '../types';

const { out, add } = builder('N', 'next');

// ───────────────────────── Basics ─────────────────────────

add('basic', 'routing',
	'Which file turns a folder inside app/ into a publicly accessible URL?',
	'page.tsx with a default-exported React component',
	['layout.tsx with a default-exported React component, since layouts define what renders at a path',
	 'index.tsx with a default-exported React component, mirroring the old Pages Router convention',
	 'Any .tsx file in the folder, because the App Router scans every component for exports'],
	'A segment becomes routable only when it contains a page (or a route.ts handler). Layouts wrap pages but never create a URL on their own, and index.tsx has no special meaning in the App Router. Other files in the folder are safely colocated and are not exposed.');

add('basic', 'params',
	'In Next.js 15 and 16, what is the type of the `params` prop passed to a page, layout or route handler?',
	'A Promise that resolves to the route parameters object',
	['A plain synchronous object such as { slug: string }, exactly as in Next.js 14',
	 'A ReadonlyURLSearchParams instance that you read with params.get()',
	 'A Proxy that logs a warning on every read but works synchronously in all 15.x and 16.x versions'],
	'Next.js 15 made params asynchronous so the framework can start rendering before request data is needed. Synchronous access worked temporarily in 15 with warnings, and was fully removed in 16. You now use await params in async components or React use(params) in Client Components.');

add('basic', 'params',
	'Which is the correct way to read the slug in an async Server Component page in Next.js 16?',
	'const { slug } = await params;',
	['const { slug } = params;',
	 'const slug = useParams().slug;',
	 'const slug = params.get(\'slug\');'],
	'params is a Promise, so it must be awaited (or unwrapped with use() in Client Components). Destructuring the Promise directly gives undefined and a type error. useParams is a Client Component hook, and params is not a URLSearchParams, so it has no get method.',
	`// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // read slug here
}`);

add('basic', 'layouts',
	'What happens to a shared layout when the user navigates between two pages that both use it?',
	'It stays mounted: its state is preserved and it does not re-render',
	['It unmounts and remounts so that its useState values reset on every navigation',
	 'It is re-fetched from the server and fully re-rendered with the new page inside',
	 'It is duplicated, one copy for each page, so layout state is separate per page'],
	'Layouts are preserved across navigations so that state, scroll position and DOM stay intact, and only the changing segments render again. That is also why layouts cannot read searchParams or the pathname during rendering. If you want state to reset on each navigation, use a template instead.');

add('basic', 'layouts',
	'Which two tags must the root layout (app/layout.tsx) render?',
	'<html> and <body>',
	['<head> and <body>, with <html> added automatically by Next.js',
	 '<html> and <main>, because <body> is added by Next.js',
	 '<Document> and <Main> imported from next/document'],
	'The root layout owns the document shell, so it must define <html> and <body>. You should not hand-write <head> tags such as <title>; the Metadata API handles those. next/document belongs to the Pages Router (_document.tsx).');

add('basic', 'routing',
	'What effect does wrapping a folder name in parentheses, like app/(marketing)/about/page.tsx, have on the URL?',
	'The group folder is omitted, so the page is served at /about',
	['The page is served at /(marketing)/about, with the parentheses URL-encoded',
	 'The page is served at /marketing/about, and the parentheses only affect sorting',
	 'The page becomes private and cannot be reached by any URL'],
	'Route groups organise files and let you share or isolate layouts without changing the URL. The folder name in parentheses is simply dropped from the path. Making a folder non-routable is the job of private folders that start with an underscore.');

add('basic', 'routing',
	'What does prefixing a folder name with an underscore, such as app/_components, do?',
	'Opts the folder and its children out of routing',
	['Marks every component inside as a Client Component automatically',
	 'Makes the folder a route group whose layout applies to all sibling routes',
	 'Hides the files from the bundler so they are never compiled'],
	'Private folders are excluded from the routing system, so you can colocate helpers and components next to routes without any risk of them becoming URLs. They are still compiled normally when imported. The use client directive is unrelated to folder names.');

add('basic', 'routing',
	'Given app/shop/[[...slug]]/page.tsx, which URL does this route match that app/shop/[...slug]/page.tsx would not?',
	'/shop, since the optional catch-all allows zero extra segments',
	['/shop/a/b/c, because only the optional version matches multiple segments',
	 '/shop/a, because only the optional version accepts a single segment',
	 '/, because optional catch-alls also match the site root'],
	'A regular catch-all [...slug] needs at least one segment after /shop. The optional form [[...slug]] also matches /shop itself, with params.slug undefined. Both forms match multiple segments, and neither can match the root outside /shop.');

add('basic', 'rsc',
	'In the App Router, what kind of component is a page or layout by default?',
	'A Server Component',
	['A Client Component that is hydrated on load',
	 'A Server Component only in production; in development everything is a Client Component',
	 'Whatever kind the first import in the file determines'],
	'Every component in the app directory is a Server Component unless it, or a module above it in the import chain, is marked with use client. They render on the server, send no component JavaScript to the browser, and can be async. Development and production use the same rules.');

add('basic', 'rsc',
	'Which of these components must have the use client directive?',
	'A component using useState and an onClick handler',
	['An async component that awaits a database query',
	 'A component that reads process.env.DATABASE_URL on the server',
	 'A component that only renders props into JSX with no hooks'],
	'State, effects, event handlers and browser APIs need the client. Data fetching, secrets access and plain rendering are all better on the server, and adding use client there would only increase the bundle size.');

add('basic', 'rsc',
	'Where must the use client directive be written?',
	'At the very top of the file, above all imports',
	['Inside the component function body, before the first hook call',
	 'In next.config.ts, listing the files that should be Client Components',
	 'On the import statement of the parent that renders the component'],
	'use client is a module-level directive that declares the boundary between the server and client module graphs. Placing it after code or inside a function means it is ignored. It marks the file as an entry point, so everything it imports joins the client bundle.',
	`// app/ui/counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`);

add('basic', 'navigation',
	'Where should useRouter be imported from in the App Router?',
	'next/navigation',
	['next/router (as in the Pages Router)',
	 'next/link (alongside the Link component)',
	 'next/server (with NextRequest)'],
	'The App Router hook lives in next/navigation, next to usePathname, useSearchParams and redirect. next/router is the Pages Router version with a different API (it had pathname, query and events). Importing it in the app directory throws an error about the router not being mounted.');

add('basic', 'navigation',
	'What does usePathname() return for the URL /dashboard/settings?tab=profile#top?',
	'"/dashboard/settings"',
	['"/dashboard/settings?tab=profile"',
	 '"/dashboard/settings?tab=profile#top"',
	 '"https://example.com/dashboard/settings"'],
	'usePathname returns only the path portion of the URL, without the query string or hash. Use useSearchParams for the query string. It is a Client Component hook that updates on navigation.');

add('basic', 'navigation',
	'When does a next/link <Link> prefetch its target by default?',
	'In production builds, when the link enters the viewport',
	['Only when the user hovers or focuses the link, in both development and production',
	 'On every render of the page, including in development',
	 'Never; prefetching only happens if you pass prefetch={true}'],
	'Prefetching is enabled only in production and starts when the link scrolls into view. Passing prefetch={false} disables it. In next dev you will not see prefetch requests, so measure navigation speed on a production build.');

add('basic', 'navigation',
	'What HTTP status does permanentRedirect() use, compared with the default status of redirect()?',
	'permanentRedirect uses 308; redirect uses 307',
	['permanentRedirect uses 301; redirect uses 302',
	 'permanentRedirect uses 308; redirect uses 302',
	 'Both use 307; permanentRedirect only differs by adding cache headers'],
	'Next.js uses 307 and 308 rather than 302 and 301 so that the request method (for example POST) is preserved on redirect. Use permanentRedirect when the move is permanent. Server Action form submissions are an exception: they respond with 303 so the browser follows with a GET.');

add('basic', 'navigation',
	'What does calling notFound() from next/navigation inside a Server Component do?',
	'Stops rendering and shows the nearest not-found.tsx',
	['Returns the string "404" so you must return it from the component',
	 'Redirects the user to /404 using a 307 response',
	 'Logs a warning and continues rendering the rest of the page'],
	'notFound throws a special error, so no return statement is needed and code after it does not run. Next.js renders the closest not-found file in the tree. The status is 404 when it happens before the response starts streaming; once streaming has begun, the status remains 200.');

add('basic', 'loading',
	'What does a loading.tsx file in a route segment do?',
	'Wraps the page in Suspense and shows its UI while the content streams in',
	['Blocks navigation until every fetch in the page finishes, then shows the page',
	 'Runs once on the client during hydration to show a splash screen for the whole app',
	 'Catches errors thrown by the page and shows a fallback UI'],
	'loading.tsx is sugar for wrapping the segment page in <Suspense fallback={...}>, which lets the layout render immediately and the page stream in. It does not handle errors, which is the job of error.tsx. It also does not run only once on initial load; it applies on every navigation into the segment.');

add('basic', 'errors',
	'Why must error.tsx start with the use client directive?',
	'Error boundaries are a client-side React feature, so the file must be a Client Component',
	['Because error.tsx runs only in the browser and never on the server',
	 'Because it reads the request cookies and headers, which are only available on the client',
	 'Because Next.js bundles server files without exports, and use client forces a default export'],
	'React error boundaries are implemented as class components with client-side state, so error.tsx has to be a Client Component. It does receive errors that happened on the server, with the details hidden in production. It is not limited to the browser, since the fallback can be server-rendered.');

add('basic', 'errors',
	'What must a global-error.tsx component render that a regular error.tsx must not?',
	'Its own <html> and <body> tags, as it replaces the root layout',
	['A <head> with a title tag, since metadata exports are supported there',
	 'A <Suspense> boundary so the error UI can stream',
	 'Nothing special; it is identical to error.tsx and just sits at the app root'],
	'global-error replaces the root layout when an error occurs in it, so it has to provide the document shell itself. Because it is an error boundary and thus a Client Component, metadata exports are not supported there. A Suspense wrapper is not required.');

add('basic', 'metadata',
	'How do you define static metadata such as a title for a route in the App Router?',
	'Export a typed metadata const from a layout or page',
	['Render a <Head> component from next/head inside the page',
	 'Add a <title> tag manually inside the root layout\'s <head>',
	 'Call setMetadata() from next/metadata inside a useEffect'],
	'The Metadata API uses a metadata export (or a generateMetadata function) in layout.tsx or page.tsx, and Next.js builds the head tags with deduplication and streaming support. next/head is the Pages Router approach. Manually writing head tags in the root layout is discouraged for exactly that reason.',
	`// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About us',
  description: 'Who we are',
};`);

add('basic', 'metadata',
	'Which options must be set so a title.template in a layout takes effect for child pages?',
	'title.default must be provided alongside title.template',
	['title.absolute must be set on the layout alongside the template',
	 'The template must also be exported from every page that wants to use it',
	 'metadataBase must be set to an absolute URL'],
	'A layout that defines title.template must also define title.default, which is used by child segments that set no title of their own. Children that do export a title get the template applied with %s replaced. title.absolute is the opposite tool: it lets a child skip the parent template.');

add('basic', 'images',
	'Which props does next/image require for a remote image whose dimensions Next.js cannot know ahead of time?',
	'alt, plus either width and height or the fill prop',
	['Only src, because Next.js downloads the image and measures it at build time',
	 'priority and sizes, so the browser can pick the right file',
	 'unoptimized and loader, since remote images cannot be optimized'],
	'Remote images need explicit width and height, or fill to size them from a positioned parent, so the browser can reserve space and avoid layout shift. alt is also required. Priority, sizes and unoptimized are optional tuning props.');

add('basic', 'images',
	'Where do you allow external image hostnames for next/image in a current Next.js project?',
	'images.remotePatterns in next.config',
	['images.domains in next.config, which is the recommended replacement for remotePatterns',
	 'A <meta> allowlist exported from the root layout',
	 'The src prop itself, which is auto-allowed if it uses https'],
	'remotePatterns lets you restrict protocol, hostname, port and pathname, which makes it safer. images.domains is deprecated in Next.js 16 (it was already discouraged) and next/image rejects unlisted remote hosts with a runtime error. Nothing is auto-allowed just because it uses https.');

add('basic', 'fonts',
	'How does next/font/google load a Google font?',
	'Files are downloaded at build time and self-hosted; browsers never call Google',
	['A <link> to fonts.googleapis.com is injected and the browser fetches the font at runtime',
	 'The font is fetched from Google by the server on every request and streamed inline',
	 'Nothing is downloaded; the font is referenced by name and the OS supplies it'],
	'next/font self-hosts the font files with the rest of your static assets and generates size-adjusted fallbacks to reduce layout shift. That improves privacy and performance because no third-party request is made by the visitor. Calling the loader returns className, style and optional CSS variable values.');

add('basic', 'route-handlers',
	'How do you define an HTTP endpoint in the App Router?',
	'Add route.ts and export functions named after HTTP verbs (GET, POST...)',
	['Create a file under pages/api and export a default handler(req, res)',
	 'Add a page.tsx and export a function named api from it',
	 'Add a route.ts and export one default function that checks req.method itself'],
	'Route Handlers use the Web Request and Response APIs, with one named export per method (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS). The pages/api style with a default handler is the Pages Router API Routes system. A page.tsx and route.ts cannot exist in the same segment.',
	`// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true });
}`);

add('basic', 'route-handlers',
	'Since Next.js 15, are GET Route Handlers cached by default?',
	'No; opt in with export const dynamic = \'force-static\'',
	['Yes; GET handlers are cached indefinitely unless they read cookies',
	 'Yes, but only in production, and only for 60 seconds',
	 'No, and there is no way to opt in to caching for handlers at all'],
	'Next.js 14 cached GET handlers by default, which surprised many people. Next.js 15 flipped the default to uncached and you can opt back in with static route config such as dynamic = \'force-static\' or a revalidate export. Special metadata routes such as sitemap.ts remain static by default.');

add('basic', 'env',
	'What does the NEXT_PUBLIC_ prefix on an environment variable do?',
	'Inlines the value into the JavaScript bundle at build time so the browser can read it',
	['Makes the variable available in the browser at runtime, re-read from the server on every request',
	 'Encrypts the value so it is safe to ship to the browser',
	 'Lets the variable be set in the browser console without a rebuild'],
	'Without the prefix a variable exists only in the Node.js environment. With it, next build replaces references to process.env.NEXT_PUBLIC_X with the literal value, so changing it later requires a rebuild. The value is public, never encrypted, so never put secrets in it.');

add('basic', 'env',
	'In a project that uses a src/ directory, where should the .env files live?',
	'In the project root, next to package.json',
	['Inside src/, next to the app directory',
	 'Inside src/app/, next to the root layout',
	 'Anywhere, as Next.js searches all folders for .env files'],
	'Next.js loads .env files from the project root only, even when the source code lives in src/. Putting .env inside src/ means the variables silently never load. The same rule applies to .env.local and the environment-specific variants.');

add('basic', 'cli',
	'In Next.js 16, which bundler does next dev and next build use by default?',
	'Turbopack',
	['Webpack, with Turbopack available behind a --turbo flag',
	 'esbuild, with Turbopack only used for production',
	 'Rspack, which replaced both Webpack and Turbopack'],
	'Turbopack became stable and the default for both development and production in Next.js 16, so you no longer pass --turbopack. You can opt out with next dev --webpack or next build --webpack. A custom webpack config makes the default next build fail until you choose a bundler explicitly.');

add('basic', 'params',
	'How do you read a cookie inside a Server Component in Next.js 16?',
	'const store = await cookies(); store.get(\'theme\')',
	['const store = cookies(); const theme = store.get(\'theme\')',
	 'const theme = document.cookie',
	 'const theme = useCookies().get(\'theme\')'],
	'cookies() from next/headers is async since Next.js 15, and synchronous access was removed in 16. document.cookie does not exist on the server, and useCookies is not a Next.js API. Reading cookies makes the route dynamic, since the data depends on the request.',
	`// app/page.tsx
import { cookies } from 'next/headers';

export default async function Page() {
  const store = await cookies();
  return <p>{store.get('theme')?.value}</p>;
}`);

// ───────────────────────── Intermediate ─────────────────────────

add('mid', 'params',
	'This page worked in Next.js 14. What is wrong with it in Next.js 16?',
	'params is a Promise and must be awaited; synchronous access was removed in 16',
	['params must be imported from next/navigation instead of being a prop',
	 'Page components can no longer take props; params must come from useParams',
	 'Nothing is wrong, because the build adds a compatibility shim for sync access'],
	'In Next.js 15 params became a Promise with temporary synchronous compatibility that warned. Next.js 16 removed that compatibility, so params.slug is undefined and the types fail. Use async/await, or run npx @next/codemod@canary next-async-request-api to migrate.',
	`// app/blog/[slug]/page.tsx
export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  return <h1>{params.slug}</h1>;
}`);

add('mid', 'params',
	'A Client Component page needs a dynamic param. How do you read it in Next.js 15+?',
	'Unwrap the promise with React use(params)',
	['Mark the component async and await params',
	 'Read params.slug directly, because Client Components get resolved values',
	 'Call useEffect and await params inside it, storing the result in state'],
	'Client Components cannot be async, so React provides use() to read a Promise during render, suspending until it resolves. Awaiting inside an effect adds a pointless render with empty state. Client Components receive the same Promise as Server Components do.',
	`// app/blog/[slug]/page.tsx
'use client';

import { use } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <h1>{slug}</h1>;
}`);

add('mid', 'params',
	'After running next typegen (added in Next.js 15.5), how can you type a page\'s props for the route /blog/[slug]?',
	'Use the global PageProps helper: PageProps<\'/blog/[slug]\'>, with no import needed',
	['Import PageProps from next/types and pass the folder path as a file URL',
	 'Import PageProps from next, then call PageProps(\'/blog/[slug]\') to build the type',
	 'You must still hand-write { params: Promise<{ slug: string }> } because the helper only types layouts'],
	'next typegen, next dev and next build generate route types, which make PageProps, LayoutProps and RouteContext globally available. They give typed params (and searchParams for pages), and LayoutProps also types parallel route slots. Nothing has to be imported.',
	`// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  return <h1>{slug}</h1>;
}`);

add('mid', 'params',
	'For the URL /search?tag=a&tag=b, what is the value of tag in the awaited searchParams of a page?',
	'The array [\'a\', \'b\']',
	['The string \'a\', because only the first value is kept',
	 'The string \'a,b\', joined with a comma',
	 'The string \'b\', because the last value wins'],
	'Page searchParams is a plain object whose values are string | string[] | undefined. Repeated keys become arrays, so handle both shapes. In the Client Component hook, searchParams.get(\'tag\') returns the first value and getAll returns all of them.');

add('mid', 'layouts',
	'Why does a layout not receive a searchParams prop?',
	'Layouts do not re-render on navigation, so it would go stale',
	['Because query strings are never sent to the server in the App Router',
	 'Because Server Components cannot read the URL at all',
	 'Because only the root layout may receive searchParams'],
	'Shared layouts are preserved and not re-rendered when a child page changes, so a prop derived from the query would go stale. Read search params in the page, or in a Client Component using useSearchParams, since Client Components re-render when the URL changes. The same reasoning is why layouts cannot read the pathname.');

add('mid', 'layouts',
	'How can a navigation component inside a shared layout highlight the active link?',
	'Make the nav a Client Component and use usePathname or useSelectedLayoutSegment',
	['Read pathname from the props of the layout and compare it in the Server Component',
	 'Call window.location.pathname inside the Server Component layout',
	 'Export an activePath constant from every page and import it in the layout'],
	'Layouts do not get the pathname, and a Server Component has no window. Extracting the links into a small Client Component that calls usePathname lets only that part re-render on navigation while the layout stays a Server Component. useSelectedLayoutSegment is helpful for matching one level of the route.',
	`// app/ui/nav-links.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav>
      <Link className={pathname === '/' ? 'active' : ''} href="/">Home</Link>
    </nav>
  );
}`);

add('mid', 'layouts',
	'How does a template.tsx differ from a layout.tsx in the same segment?',
	'A template gets a new instance on each navigation, so state resets and effects re-run',
	['A template is rendered only on the server, while a layout is rendered only on the client',
	 'A template wraps the root layout, while a layout wraps only pages',
	 'A template can read searchParams, while a layout cannot'],
	'Layouts persist across navigations, while templates re-mount children on every navigation (they are keyed by the route). Use them for enter animations, per-page effects such as logging page views, or state that must reset. Both can be Server Components, and the template renders inside the layout.');

add('mid', 'layouts',
	'A layout needs a user object that its child page also needs. What is the recommended way to avoid fetching it twice?',
	'Fetch in both places and dedupe with React cache or memoized fetch',
	['Pass it from the layout to the page through the children prop',
	 'Store it in a module-level variable in the layout so the page can import it',
	 'Fetch it only in the layout and read it in the page with useContext'],
	'Layouts cannot pass data to their children, and Server Components cannot use context. The supported approach is to call the same data function in both places: identical fetch calls are memoized per request, and non-fetch work such as a DB query can be wrapped in React cache. A module-level variable would leak data across requests.');

add('mid', 'layouts',
	'An app has app/(shop)/layout.tsx and app/(blog)/layout.tsx, each rendering <html> and <body>, with no app/layout.tsx. What is true when navigating from a shop page to a blog page?',
	'It triggers a full page load, because the root layout changes',
	['It is a normal client-side navigation, and both layouts are kept mounted',
	 'The build fails, because the app directory must always contain app/layout.tsx',
	 'It is a client-side navigation, but state in the shop layout is kept'],
	'Any layout without a layout above it is a root layout, and an app may have several of them, typically via route groups. Navigating across different root layouts cannot reuse the client tree, so the browser performs a full page load. Within one root layout, navigations stay client-side.');

add('mid', 'routing',
	'What happens if app/(a)/about/page.tsx and app/(b)/about/page.tsx both exist?',
	'The build fails because both pages resolve to /about',
	['The route group listed first alphabetically wins and the other is ignored',
	 'Both render, with (a) at /about and (b) at /(b)/about',
	 'Next.js merges the two pages by rendering them one after the other'],
	'Route group names do not appear in the URL, so both files map to the same path and Next.js reports a conflict. Groups are for organisation, so the files must resolve to different URLs. The same conflict error occurs when page.tsx and route.ts live in the same segment.');

add('mid', 'navigation',
	'What does <Link href="/products" scroll={false}> change?',
	'The router skips scrolling to the top after navigating',
	['It disables the browser scrollbar on the destination page',
	 'It prevents the page from being prefetched while it scrolls into view',
	 'It makes the link open in a new tab without changing scroll position'],
	'By default a client navigation scrolls to the top of the new page if it is not visible. With scroll={false} (or router.push with { scroll: false }) the current scroll position is left alone, which is useful for filters and tabs. Prefetching is controlled separately by the prefetch prop.');

add('mid', 'navigation',
	'What does the default prefetch behaviour (prefetch auto or null) do for a link to a dynamic route in a production build?',
	'It prefetches the partial route down to the nearest loading.tsx boundary',
	['It prefetches the full page including all data, as it does for static routes',
	 'It does not prefetch at all because the data is dynamic',
	 'It prefetches only when the user clicks, before navigation starts'],
	'For static routes the full route is prefetched, but for dynamic routes the shared layouts and the loading UI up to the closest loading boundary are fetched. That makes the navigation feel instant while the page itself streams. prefetch={true} forces the full route, and false disables prefetching.');

add('mid', 'navigation',
	'What does router.refresh() do?',
	'Re-fetches the route and re-renders Server Components, keeping client state',
	['Performs a full browser reload, so all client state is lost',
	 'Invalidates the server-side data cache for every route, including tagged entries',
	 'Re-renders only Client Components using the existing RSC payload'],
	'refresh fetches a fresh RSC payload and merges it, so useState values and scroll position in unaffected Client Components survive. It clears the client router cache for that route but does not invalidate server-side caches; use revalidatePath or revalidateTag for that. Cached fetch results may even return the same data.');

add('mid', 'navigation',
	'Why does this redirect never happen, and how do you fix it?',
	'redirect throws and catch swallows it; call it outside the try block',
	['redirect only works in Client Components, so it must be moved to a useEffect',
	 'redirect must be awaited because it returns a Promise',
	 'redirect needs the RedirectType.push argument to take effect inside try'],
	'redirect, notFound and similar functions work by throwing special errors that Next.js catches higher up. A broad catch swallows them, so the navigation silently does not happen. Move the call after the try/catch or rethrow Next.js errors with unstable_rethrow(error) from next/navigation.',
	`// app/team/[id]/page.tsx
import { redirect } from 'next/navigation';

export default async function Page() {
  try {
    const team = await loadTeam();
    if (!team) redirect('/login');
  } catch (e) {
    console.error(e);
  }
  return null;
}`);

add('mid', 'navigation',
	'You need to navigate after a button click handler finishes some work. Which is correct in a Client Component?',
	'Call router.push() from useRouter inside the handler',
	['Call redirect() from next/navigation inside the handler',
	 'Return a <Link> from the handler',
	 'Call permanentRedirect() inside the handler, which always works on the client'],
	'redirect can be called while rendering (including in Client Components) and in Server Actions or Route Handlers, but not inside event handlers. For handlers, use the useRouter hook, whose push and replace methods perform client-side navigations. Returning JSX from a handler does nothing.');

add('mid', 'navigation',
	'In Next.js 16, what is the effect of the router rewrite described as layout deduplication and incremental prefetching?',
	'A shared layout downloads once and only uncached parts are prefetched',
	['Layouts are no longer cached on the client, and each link always re-fetches its layout',
	 'All links on a page are prefetched as one combined request',
	 'Prefetching is now disabled for links that share a layout'],
	'Next.js 16 changed prefetching so a page with 50 links to routes under one layout downloads that layout once. Requests for links that leave the viewport are cancelled, and links are re-prefetched when data is invalidated. You may see more individual requests, but the total transfer is much smaller, and no code changes are required.');

add('mid', 'navigation',
	'Why does this component make next build fail on a statically rendered page, even though it works in next dev?',
	'It needs a Suspense boundary when prerendered; dev does not enforce this',
	['useSearchParams is not allowed in Client Components, only in Server Components',
	 'The component must be async to call useSearchParams',
	 'Search params cannot be read at all in a statically rendered page'],
	'In a prerendered route, useSearchParams forces client-side rendering up to the nearest Suspense boundary, and the build errors if there is none. In development routes render on demand, so nothing complains. Wrap the component in <Suspense> with a fallback, or make the route dynamic.',
	`// app/dashboard/page.tsx
import SearchBar from './search-bar';

export default function Page() {
  return (
    <nav>
      <SearchBar />
    </nav>
  );
}`);

add('mid', 'navigation',
	'How do you update a query parameter from a Client Component in the App Router?',
	'Build a new query string and push it with router or <Link>',
	['Call searchParams.set(\'sort\', \'asc\') on the object returned by useSearchParams',
	 'Assign to window.location.search, which Next.js intercepts and turns into a soft navigation',
	 'Mutate the searchParams prop of the page and call forceUpdate'],
	'useSearchParams returns a read-only URLSearchParams. The usual pattern copies it into a new URLSearchParams, sets the key, and pushes pathname plus the new string. After the navigation, the page receives the new searchParams prop and Client Components see the new hook value.');

add('mid', 'navigation',
	'The Pages Router had router.events for route changes. How do you react to route changes in the App Router?',
	'Combine usePathname and useSearchParams in an effect inside a Client Component',
	['Subscribe with router.events.on(\'routeChangeComplete\') from next/navigation',
	 'Export an onNavigate function from the root layout',
	 'Add a middleware that posts a message to the page on every request'],
	'router.events does not exist in next/navigation. Because the pathname and search params hooks change on navigation, an effect that depends on them acts as a change listener, as the docs show. Wrap it in Suspense because it uses useSearchParams.');

add('mid', 'navigation',
	'How does the onNavigate prop of <Link> (added in Next.js 15.3) differ from onClick?',
	'It runs only for client-side navigations and can cancel them',
	['It runs after the destination page has finished rendering',
	 'It runs for every click, including Ctrl-click and links with a download attribute',
	 'It replaces the href and is used to rewrite the destination URL'],
	'onClick fires for every click, including modifier-key clicks that open new tabs and external links. onNavigate fires only when Next.js actually performs a same-origin SPA navigation, and calling preventDefault on its event cancels it. That makes it a good place for unsaved-changes guards.');

add('mid', 'rsc',
	'A Server Component passes an inline callback to a Client Component. What happens?',
	'It fails: functions are not serializable props',
	['It works, and the function runs on the server whenever the client calls it',
	 'It works, because Next.js converts every function prop into a Server Action',
	 'It works but the function is called twice, once per environment'],
	'Props crossing the boundary are serialized into the RSC payload, so only serializable values (plain objects, arrays, primitives, Dates, Promises, JSX, Server Actions) are allowed. An ordinary closure cannot be serialized. Make the handler live inside the Client Component, or use a Server Action marked with use server.',
	`// app/page.tsx (Server Component)
import Button from './button';

export default function Page() {
  return <Button onPress={() => console.log('hi')} />;
}`);

add('mid', 'rsc',
	'A Client Component <Modal> renders {children}. A Server Component page renders <Modal><Cart /></Modal> where Cart is an async Server Component. Where does Cart run?',
	'On the server; the Modal receives the already-rendered output as children',
	['In the browser, because it is nested inside a Client Component',
	 'In both places, because it is imported into the client module graph',
	 'It cannot run anywhere, because a Client Component cannot render a Server Component'],
	'Server Components passed as children or other props are not part of the Client Component module graph. They render on the server and the client receives their output, with placeholders for Client Components. Only a Server Component that is imported directly inside a use client file would be pulled into the client bundle.');

add('mid', 'rsc',
	'A third-party carousel uses useState but its package has no use client directive. What is the correct way to use it in a Server Component page?',
	'Re-export it from a small file that starts with use client, then import that wrapper',
	['Add use client to the page itself, making the whole page a Client Component',
	 'Wrap it with the dynamic() helper and set ssr: true',
	 'It works as-is, because Server Components fall back to Client Components automatically'],
	'Without the directive Next.js cannot know the library needs the client, and rendering it in a Server Component throws. A one-line wrapper file with use client creates the boundary just for that component, keeping the page on the server. Library authors should add the directive to their entry points.');

add('mid', 'rsc',
	'What does importing the server-only package at the top of lib/db.ts achieve?',
	'A build-time error if a Client Component imports the module, directly or indirectly',
	['It makes every function in the file run on the server through RPC when called from the client',
	 'It strips the module from the server bundle so it only exists in the client bundle',
	 'It encrypts environment variables referenced inside the file'],
	'server-only is a guard against environment poisoning: any import chain from a Client Component to the file fails the build with a clear message. It does not create an RPC layer, which is what Server Actions are for. Without it, secrets read from non-NEXT_PUBLIC env vars would just be replaced with an empty string in the client bundle.');

add('mid', 'errors',
	'An error is thrown in app/dashboard/layout.tsx. Which boundary can catch it?',
	'An error.tsx in a parent segment, such as app/error.tsx',
	['app/dashboard/error.tsx, because it wraps everything in the segment',
	 'app/dashboard/not-found.tsx',
	 'app/dashboard/loading.tsx'],
	'error.tsx wraps the page and nested layouts of its segment, but not the layout.tsx or template.tsx that sit above it in the same segment. To catch layout errors, place the boundary one level higher. Errors in the root layout need global-error.tsx.');

add('mid', 'errors',
	'In production, an error thrown in a Server Component reaches error.tsx. What does error.message contain?',
	'A generic message plus error.digest to match server logs',
	['The original message and full stack trace, as in development',
	 'An empty string, with no digest available',
	 'The HTTP status code only'],
	'To avoid leaking sensitive details, errors from Server Components arrive with a generic message in production, plus an automatically generated digest hash. Search your server logs for the digest to find the real error. Errors that originate in Client Components keep their original message.');

add('mid', 'errors',
	'What status code does a page respond with when notFound() is called after the response has already started streaming?',
	'200, because the status line was already sent',
	['404, because Next.js buffers the response until all Suspense boundaries resolve',
	 '500, because throwing after streaming starts is treated as a server error',
	 '307, because Next.js redirects to the nearest not-found page'],
	'HTTP status codes are sent before the body, so once streaming has started the status stays 200. Next.js injects <meta name="robots" content="noindex"> so crawlers do not index the page. If a 404 status is essential, call notFound before the first byte, for example outside a Suspense boundary.');

add('mid', 'errors',
	'Which file handles requests for URLs that match no route in the app at all?',
	'The root app/not-found.tsx',
	['app/error.tsx, since unmatched URLs are errors',
	 'app/404.tsx, which is the file convention for 404 pages',
	 'Nothing; unmatched URLs always show the built-in browser error page'],
	'Since Next.js 13.3 the root not-found file handles both explicit notFound() calls and unmatched URLs. The 404.tsx convention belongs to the Pages Router. For apps with several root layouts, an experimental global-not-found.tsx (15.4+) can render a complete document.');

add('mid', 'metadata',
	'Given the files below, what is the document title for /about?',
	'About | Acme',
	['About, because a page title always overrides the template',
	 'Acme, because title.default wins whenever a child sets its own title',
	 'Acme | About, because the template wraps the parent title around the child'],
	'The root layout defines title.template, which applies to titles of child segments, so the about page title is inserted for %s. The default only appears for routes that set no title of their own. To skip the parent template you would use title.absolute in the page.',
	`// app/layout.tsx
export const metadata = {
  title: { template: '%s | Acme', default: 'Acme' },
};

// app/about/page.tsx
export const metadata = { title: 'About' };`);

add('mid', 'metadata',
	'app/layout.tsx exports openGraph with title and description. app/blog/page.tsx exports openGraph with only title. What does /blog end up with?',
	'Only the page\'s openGraph.title; the layout\'s openGraph object is replaced as a whole',
	['The page title and the layout description, because nested fields are deep-merged',
	 'The layout values only, because parents always take precedence',
	 'A build error for duplicate openGraph definitions'],
	'Metadata from segments is merged shallowly from root to leaf, so a later top-level key replaces the earlier one entirely. The description from the layout is lost. To share parts, extract a shared object and spread it into each openGraph, as shown in the docs.');

add('mid', 'metadata',
	'A product page and its generateMetadata function both need the same product. How do you avoid hitting the API twice?',
	'Reuse the same fetch (memoized), or wrap DB calls in React cache',
	['Store the product in a global variable inside generateMetadata for the page to read',
	 'Pass the product from generateMetadata to the page through the parent argument',
	 'Export a getData const from the page that Next.js calls once for both'],
	'fetch calls with the same URL and options are automatically memoized across generateMetadata, generateStaticParams, layouts, pages and other Server Components during one request. If you use a database client instead, wrap the function in React cache to get the same effect. The parent argument carries parent metadata, not data.');

add('mid', 'metadata',
	'What happens if openGraph.images uses a relative path like \'/og.png\' and no metadataBase is set anywhere?',
	'The build fails: relative URLs need a metadataBase',
	['It works, and Next.js resolves the path using the Host header at build time',
	 'It silently emits the relative path, which crawlers then resolve themselves',
	 'The field is ignored and no og:image tag is generated'],
	'Open Graph and similar fields need absolute URLs, so Next.js composes relative values with metadataBase, typically set once in the root layout via new URL(\'https://acme.com\'). Without it, using a relative path is a build error. Absolute URLs in a field bypass metadataBase.');

add('mid', 'metadata',
	'Why does exporting metadata from a page that starts with use client not work?',
	'metadata and generateMetadata are supported only in Server Components',
	['Because metadata exports are allowed only in layouts, never in pages',
	 'Because Client Components render too late to emit head tags on the server',
	 'Because metadata must be exported as default from a Client Component'],
	'Metadata must be resolved on the server before the page renders so it can be included in the HTML. Keep page.tsx as a Server Component with the export and move interactive logic into a child Client Component. The first reason is false: pages can export metadata as long as they are Server Components.');

add('mid', 'images',
	'When you use the fill prop on next/image, what must be true of the parent?',
	'It must be positioned and sized; also provide sizes',
	['It must be display: flex, so the image can stretch',
	 'It must set an explicit width and height attribute on the image as well',
	 'Nothing; fill sizes itself to the intrinsic image dimensions'],
	'fill makes the image absolutely positioned to fill its parent, so the parent needs position and a size or the image collapses to zero. The sizes prop tells the browser how wide the image will be so it picks an appropriately sized srcset entry. Width and height are not used together with fill.');

add('mid', 'images',
	'What do the width and height props of next/image determine?',
	'The aspect ratio used to reserve space; CSS controls the rendered size',
	['The exact rendered size in pixels, which CSS cannot override',
	 'The pixel size of the optimized file, which is served in that size on all devices',
	 'The maximum size the image may ever render at'],
	'The attributes tell the browser the aspect ratio before the image loads, preventing cumulative layout shift. They do not set rendered size, which CSS controls, and the optimizer picks a file width from the configured size lists based on the rendered size and sizes prop. Use style or classes to make it responsive.');

add('mid', 'images',
	'In Next.js 16, <Image src="/photo.jpg?v=2" ...> (a local file with a query string) stops working. What fixes it?',
	'Add an images.localPatterns entry with the search string',
	['Add the host to images.remotePatterns',
	 'Rename the file, because query strings are never allowed on images',
	 'Set unoptimized={false} on the component'],
	'Next.js 16 requires images.localPatterns with a search value for local sources that include a query string, to prevent enumeration attacks. remotePatterns is for external hosts. unoptimized is already false by default.');

add('mid', 'fonts',
	'You want to use Roboto (a non-variable Google font) with next/font/google. What is required?',
	'A weight option, for example weight: \'400\', and subsets for preloading',
	['Nothing extra; weight is always inferred from the CSS that uses the class',
	 'Only display: \'swap\', since the weight is downloaded lazily',
	 'You must use next/font/local because Google fonts are only variable'],
	'Variable fonts need no weight because one file contains every weight, but non-variable fonts require explicit weights so Next.js knows which files to download. Specifying subsets controls what gets preloaded, and omitting it while preload is on gives a warning. Fonts with several words use an underscore, like Roboto_Mono.');

add('mid', 'scripts',
	'Where must a next/script with strategy="beforeInteractive" be placed in the App Router?',
	'In the root layout',
	['In any page, and Next.js hoists it to the layout automatically',
	 'In next.config.ts under a scripts array',
	 'Inside a Client Component with an onLoad handler'],
	'beforeInteractive scripts are injected into the initial HTML head and run before hydration, so they must be in the root layout (for example app/layout.tsx), and are meant for site-wide critical scripts such as bot detection or consent managers. They cannot use onLoad or onError. The default strategy is afterInteractive.');

add('mid', 'route-handlers',
	'How do you read a dynamic segment in app/items/[id]/route.ts in Next.js 16?',
	'const { id } = await ctx.params',
	['Read request.params.id synchronously from the first argument',
	 'Use useParams() inside the handler',
	 'Read it from request.nextUrl.searchParams.get(\'id\')'],
	'Route handlers receive a context as their second argument with params as a Promise, and RouteContext<\'/items/[id]\'> provides types for it. The Request object has no params property, and hooks cannot be called in handlers. Query string values come from nextUrl.searchParams, not path segments.',
	`// app/items/[id]/route.ts
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/items/[id]'>
) {
  const { id } = await ctx.params;
  return Response.json({ id });
}`);

add('mid', 'route-handlers',
	'What is the correct way to read a query parameter in a Route Handler?',
	'request.nextUrl.searchParams.get(\'query\') on a NextRequest',
	['await request.searchParams, because it is a Promise in Next.js 15+',
	 'useSearchParams().get(\'query\')',
	 'The second argument, since query values arrive in context.params'],
	'NextRequest extends Request with a parsed nextUrl, so nextUrl.searchParams is a normal URLSearchParams and is synchronous. Only the route params in the context are promises. Hooks are not available in handlers.');

add('mid', 'env',
	'In which order does Next.js resolve a variable when NODE_ENV is development?',
	'process.env, then .env.development.local, .env.local, .env.development, and .env',
	['.env first, then .env.development, so the most specific file is read last and wins',
	 '.env.local, then .env, then process.env',
	 '.env.development.local, then .env.development, then .env.local, then .env'],
	'Lookup stops at the first place that defines the variable: real process.env values win, then .env.$(NODE_ENV).local, .env.local, .env.$(NODE_ENV), and finally .env. So a value in the shell environment overrides all files. In test, .env.local is skipped so test results are reproducible.');

add('mid', 'env',
	'A single Docker image is promoted from staging to production. Why is the NEXT_PUBLIC_API_URL value wrong in production?',
	'It was inlined during next build, so it reflects the build environment',
	['NEXT_PUBLIC variables are re-read on every request, but only in staging',
	 'Docker images always ignore .env files at runtime',
	 'Next.js caches the value in a cookie that survives the deploy'],
	'Because public variables are replaced with literals at build time, one image cannot serve different values. Either build per environment, or provide the value at runtime, for example by reading a server-only variable after await connection() in a Server Component, or from your own endpoint.');

add('mid', 'cli',
	'What changed about linting in Next.js 16?',
	'next lint was removed and next build no longer runs ESLint; run ESLint or Biome directly',
	['next lint now runs automatically on every next dev save',
	 'ESLint is bundled into Turbopack and cannot be configured',
	 'next lint now only works with the legacy .eslintrc format'],
	'Next.js 16 removed the next lint command and the eslint config option, and next build does not lint. A codemod (next-lint-to-eslint-cli) migrates scripts to the ESLint CLI, and @next/eslint-plugin-next now defaults to flat config. Run linting separately in CI.');

add('mid', 'data',
	'Two independent fetches are awaited one after the other in a Server Component. How do you make them run in parallel?',
	'Start both promises first, then await them with Promise.all',
	['Wrap each await in its own try/catch block',
	 'Mark the component as use client so the browser parallelises them',
	 'Add a second await in front of each call'],
	'Awaiting one call before starting the next creates a request waterfall. Initiating both before awaiting (typically with Promise.all) lets them run concurrently, so total time is the slowest request rather than the sum. Using Client Components just moves the problem to the browser.',
	`// app/dashboard/page.tsx
export default async function Page() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]);
  return <p>{user.name}: {posts.length}</p>;
}`);

add('mid', 'data',
	'What does wrapping a database helper with React cache do inside a Server Component tree?',
	'Same-argument calls in one request reuse the result',
	['It caches the result across all users until the server restarts',
	 'It moves the query to the browser',
	 'It adds a Cache-Control header to the response'],
	'React cache memoizes per server request, so a layout, page and generateMetadata can each call getUser(id) and only one query runs. It is not a cross-request cache and it does not touch HTTP headers. Automatic memoization already applies to fetch, so cache is mainly for DB or SDK calls.',
	`// lib/data.ts
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});`);

// ───────────────────────── Advanced ─────────────────────────

add('advanced', 'parallel-routes',
	'In Next.js 16, what happens at build time if a parallel route slot such as app/@analytics has no default.tsx?',
	'The build fails; every slot needs an explicit default file',
	['The build succeeds and the slot renders a 404 on hard navigation, as in Next.js 15',
	 'The build succeeds and the slot is simply omitted from the layout props',
	 'Next.js generates a default.tsx that returns null automatically'],
	'Next.js 16 requires explicit default.js files for all parallel route slots, and builds fail without them. To keep the old behavior, create a default that calls notFound(); to render nothing, return null. The implicit children slot also needs a default for when its active state cannot be recovered.');

add('advanced', 'parallel-routes',
	'A dashboard has slots @team and @analytics. After soft-navigating to /settings (only @team defines it), the user refreshes. What does @analytics render?',
	'Its default.tsx, since a reload cannot recover slot state',
	['The previous analytics page, because Next.js stores slot state in a cookie',
	 'Its page.tsx at the slot root, since root pages are always the fallback',
	 'The same content as @team'],
	'During soft navigation each slot keeps its last active subpage, even if it does not match the URL. After a full reload only the URL is available, so unmatched slots render default.tsx (and it is required in 16). This asymmetry between soft and hard navigations is a common source of modal bugs.');

add('advanced', 'parallel-routes',
	'The folder app/@modal/photo/[id]/page.tsx exists. What URL does it serve, if any?',
	'/photo/[id]; the @modal slot is not a segment',
	['/@modal/photo/[id], because folder names are used literally',
	 '/modal/photo/[id], with the @ replaced by a slash',
	 'None, because slot folders are never routable'],
	'Slots such as @modal are organisational and do not affect the URL. The page is combined with the regular route at the same level, and the layout receives it as a prop called modal. Because of that, slots at one level share a rendering mode: if one is dynamic, all must be.');

add('advanced', 'parallel-routes',
	'With the modal pattern (parallel @auth slot plus an intercepting route), why do you usually add app/@auth/[...catchAll]/page.tsx returning null?',
	'Slots keep their last page on soft navigation, so a match rendering null is needed to close the modal',
	['It enables router.back() in the modal close button by registering the previous URL as a history entry for the slot',
	 'It makes the intercepted route reachable by direct URL, so reloading /login keeps showing the modal overlay',
	 'It prevents the modal route from being prerendered at build time, which would otherwise leak its HTML'],
	'Because unmatched slots stay on their previous state during client navigations, clicking a Link to /foo would leave the modal visible. A catch-all that returns null matches every other path and therefore replaces the modal with nothing. router.back() works regardless, and direct URL access is handled by the regular route outside the slot.');

add('advanced', 'parallel-routes',
	'Which folder name intercepts /photo/[id] from inside app/feed/@modal/(..)photo/[id]/page.tsx, where feed and photo are siblings?',
	'(..)photo, since slots do not count as route segments',
	['(..)(..)photo, since @modal is one directory level and feed is another',
	 '(.)photo, since the file sits next to a photo folder',
	 '(...)photo, because slots always require the root matcher'],
	'The (..) matcher is based on route segments, so @modal is ignored even though it is a folder level in the file system. From the feed segment, photo is one level above, hence (..). (.) matches the same level, (..)(..) two levels above, and (...) from the app root.');

add('advanced', 'parallel-routes',
	'A dashboard layout receives user and admin slots and returns role === \'admin\' ? admin : user. A normal user should not see admin stats. What is the security issue?',
	'Both slots still render on the server, so @admin runs its data fetching; authorize inside each slot',
	['None; the unused slot is never rendered, so its page code and data fetching never run for normal users',
	 'The layout cannot be async, so it cannot check roles before choosing which slot to display to the user',
	 'The admin slot is sent to the browser as an HTML comment that any user can find in the page source'],
	'Parallel routes are all rendered by the server whether or not the layout uses them, and the output is included in the response payload. The conditional controls what is displayed, not what runs or is sent. Check permissions where the data is read, for example in a data access layer or inside each page.');

add('advanced', 'loading',
	'A layout runs await cookies() and an uncached fetch directly in its body (Cache Components off). Why might a loading.tsx in the same segment never show a fallback on navigation?',
	'loading.tsx is below the layout, so navigation blocks until the layout finishes',
	['loading.tsx only works in the root segment of the app, never in nested route folders',
	 'Layouts that read cookies disable all Suspense boundaries underneath',
	 'loading.tsx works only with client-side data fetching'],
	'The loading file creates a Suspense boundary around the page and below the layout, so it cannot cover slow work in the layout itself. To get an instant shell, wrap runtime data access in the layout in its own Suspense boundary, or move the fetching down into the page.');

add('advanced', 'errors',
	'Which component order from outermost to innermost matches how a segment is composed?',
	'layout, template, error, loading, not-found, page',
	['layout, loading, error, template, page, not-found',
	 'error, layout, template, loading, page, not-found',
	 'template, layout, loading, error, not-found, page'],
	'Per the file conventions, layout wraps template, which wraps the error boundary, then loading (Suspense), then not-found, then page. That is why error.tsx can catch errors from the page and nested layouts but not from the layout and template of the same segment, and why a not-found UI is itself wrapped by loading and error.');

add('advanced', 'errors',
	'Why can unstable_rethrow(error) be needed in a catch block in a Server Component?',
	'To let redirect, notFound and similar framework errors pass through the catch',
	['To convert any caught error into a 500 response with the digest attached for logs',
	 'To log the error with its digest to the server console before rendering the fallback',
	 'To retry the failed fetch automatically with exponential backoff before giving up'],
	'Functions such as redirect and notFound throw internal errors, and some dynamic APIs also signal Next.js by throwing. A catch-all try/catch intercepts them and breaks navigation or rendering. unstable_rethrow checks whether the error is one of those framework errors and rethrows it, so you only handle real application errors.',
	`import { unstable_rethrow } from 'next/navigation';

async function load() {
  try {
    return await riskyCall();
  } catch (err) {
    unstable_rethrow(err);
    return null;
  }
}`);

add('advanced', 'static-params',
	'In app/products/[category]/[product]/page.tsx, how many times does a generateStaticParams defined on the [product] segment run when the parent layout also has generateStaticParams for [category]?',
	'Once per params object the parent generated',
	['Once in total, with the combined list of all products',
	 'Once per request at runtime, never at build',
	 'Never, because child segments cannot define generateStaticParams'],
	'Child generateStaticParams functions execute for each set of params the parent generates, and receive the parent segment params, so you can fetch only that category\'s products. You can generate params for a segment and those above it, but a layout cannot generate params for segments below it. The alternative is one bottom-up function on the page returning both keys.',
	`// app/products/[category]/[product]/page.tsx
export async function generateStaticParams({
  params: { category },
}: {
  params: { category: string };
}) {
  const items = await getProducts(category);
  return items.map((p) => ({ product: p.id }));
}`);

add('advanced', 'static-params',
	'What does export const dynamicParams = false change for a route with generateStaticParams?',
	'Paths not returned by generateStaticParams give 404',
	['Params are no longer available as props, so you must use useParams',
	 'generateStaticParams is skipped and all paths are rendered at request time',
	 'The page can only be reached when the dynamic segment is a number'],
	'By default (dynamicParams = true) paths missing from generateStaticParams are rendered the first time they are requested. Setting it to false restricts the route to the prerendered list, and others 404. Returning an empty array instead means "render everything on first visit".');

add('advanced', 'static-params',
	'What is the correct return value of generateStaticParams for app/docs/[...slug]/page.tsx to prerender /docs/a/b?',
	'[{ slug: [\'a\', \'b\'] }]',
	['[{ slug: \'a/b\' }]',
	 '[\'a/b\']',
	 '[{ slug: \'a\' }, { slug: \'b\' }]'],
	'For catch-all segments each params object holds an array of strings, matching what the page later receives in params. A slash-joined string would be treated as a single segment value, and two separate objects would prerender /docs/a and /docs/b. Single dynamic segments use plain strings.');

add('advanced', 'metadata',
	'In Next.js 16, what is the type of the params argument and id passed to an opengraph-image.tsx default export that uses generateImageMetadata?',
	'params is a Promise, and id is a Promise<string>',
	['Both are plain synchronous values, same as Next.js 14',
	 'params is a Promise but id is still a synchronous number',
	 'Both are synchronous, but only in development'],
	'Next.js 16 aligned image-generating files (opengraph-image, twitter-image, icon, apple-icon) with the async request API change, so both params and id must be awaited. The generateImageMetadata function itself still receives synchronous params. The sitemap function\'s id from generateSitemaps was likewise made a Promise<string>.',
	`// app/shop/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return new ImageResponse(<div>{slug}</div>);
}`);

add('advanced', 'metadata',
	'How does streaming metadata (Next.js 15.2+) behave for a social preview crawler such as facebookexternalhit?',
	'It detects such bots by user agent and blocks until metadata is in head',
	['The metadata is streamed after the body, and the bot sees it only if it runs JavaScript',
	 'The bot receives no metadata, so you must pre-generate static files',
	 'All visitors receive metadata in the body, because streaming does not support head tags'],
	'With streaming, generateMetadata can resolve after the initial UI is sent and the tags are appended to the body, which JavaScript-capable crawlers such as Googlebot understand. Bots that cannot execute JavaScript are recognised through the user agent (configurable with htmlLimitedBots), and for them metadata blocks rendering and lands in the head.');

add('advanced', 'metadata',
	'In generateMetadata you want to extend, not replace, openGraph images set by a parent layout. How?',
	'Await parent and spread its openGraph.images into the new array',
	['Return openGraph with images: [] and Next.js will merge it automatically',
	 'Export a second function named mergeMetadata',
	 'Use title.template, which also applies to images'],
	'Because metadata merging is shallow, returning openGraph replaces the parent value. generateMetadata receives parent, a Promise of the already-resolved parent metadata, so you can await it and compose the new array yourself. This is the documented pattern.',
	`// app/products/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: PageProps<'/products/[id]'>,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const previous = (await parent).openGraph?.images || [];
  return { openGraph: { images: [\`/img/\${id}.png\`, ...previous] } };
}`);

add('advanced', 'rsc',
	'A Client Component receives a Promise prop from its parent Server Component. How can it consume the data without being async?',
	'Read it with use(), inside a Suspense boundary',
	['Call await on the prop inside useEffect and set state',
	 'Promises cannot cross the boundary, so convert to JSON first',
	 'Pass it as the key prop of the component'],
	'Promises are serializable props, so the server can start a fetch, pass the unresolved promise, and stream the result. In the client, use(promise) suspends until resolution, which is why a Suspense boundary is needed. This pattern avoids blocking the parent\'s render with an await.');

add('advanced', 'env',
	'A Server Component needs a non-public variable that must be read at request time, not frozen at build. What does the Next.js 16 guide recommend?',
	'Call await connection() before reading process.env, so the read happens during dynamic rendering',
	['Prefix the variable with NEXT_PUBLIC_',
	 'Read the variable in the module scope for caching',
	 'Use publicRuntimeConfig from next.config'],
	'Server-only variables are normally read at runtime already, but a statically prerendered page would capture the value at build time. connection() (or other request-time APIs such as cookies()) opts the component into dynamic rendering so the read happens per request. publicRuntimeConfig and serverRuntimeConfig were removed in Next.js 16.');

add('advanced', 'env',
	'.env contains TWITTER_USER=nextjs and TWITTER_URL=https://x.com/$TWITTER_USER. What is process.env.TWITTER_URL, and how do you keep a literal dollar sign?',
	'https://x.com/nextjs; escape the dollar as \\$ to keep it literal',
	['https://x.com/$TWITTER_USER; variables are never expanded',
	 'https://x.com/; unknown variables expand to nothing',
	 'https://x.com/nextjs; a literal dollar sign cannot be kept at all'],
	'Next.js expands $VARIABLE references inside .env files, so values can be composed from other secrets. If a value legitimately contains a dollar sign, such as part of a password, escape it with a backslash. Expansion happens when the files are loaded, not at runtime in the browser.');

add('advanced', 'config',
	'Where does the Turbopack config live in Next.js 16, and what changed from 15?',
	'Top-level turbopack key (was experimental.turbopack)',
	['Under experimental.turbopack in both versions',
	 'In a separate turbopack.config.ts file',
	 'Under webpack.turbopack, as an alias of webpack options'],
	'Turbopack options graduated with the stable release, so they move to a top-level turbopack property, for example turbopack.resolveAlias. The upgrade codemod migrates it for you. Options such as the filesystem cache stay under experimental flags until stabilized.');

add('advanced', 'typescript',
	'In a nested generateStaticParams for app/products/[category]/[product]/page.tsx, how can you type the parent params using the Next.js helpers?',
	'Use Awaited<LayoutProps<\'/products/[category]\'>[\'params\']>, since the helper types params as a Promise',
	['Use LayoutProps<\'/products/[category]\'>[\'params\'] directly, since generateStaticParams receives a Promise',
	 'Use PageProps<\'/products/[category]/[product]\'>, which includes the helper function',
	 'Cast to any, since no types exist for generateStaticParams'],
	'The helper types describe the props Next.js passes to layouts and pages, where params is a Promise. generateStaticParams receives parent params as a plain object, so the docs unwrap the type with Awaited. Using the unwrapped type is the only way to keep the destructuring valid.');

add('advanced', 'navigation',
	'A Server Action form submission calls redirect(\'/done\'). What does the browser get when JavaScript has not loaded yet?',
	'A 303 response, so the browser follows it with a GET',
	['A 308 response, because redirects are permanent in Server Actions',
	 'A 200 response with a script that sets window.location',
	 'A 307 response that re-submits the POST to /done'],
	'With JavaScript the action performs a client-side navigation. For progressive enhancement (no JS), redirect serves a 303, which tells the browser to switch to GET, avoiding a repeated POST. In a Server Action `redirect` always uses 303, whereas in other contexts it uses 307; `permanentRedirect` is the one that uses 308.');

add('advanced', 'navigation',
	'redirect() is called while a page is streaming, after the status line was already sent. How does Next.js perform the redirect?',
	'It streams a meta tag that makes the client redirect',
	['It rewrites the already-sent status line to 307',
	 'It silently ignores the redirect and keeps rendering',
	 'It aborts the connection so the browser retries the request'],
	'Once streaming starts the status code cannot change, so Next.js emits a meta tag in the streamed HTML to make the browser redirect. If the redirect happens before streaming starts, a real HTTP 307 (or 308 with permanentRedirect) is returned. This is why guards that redirect should run early, before any Suspense output flushes.');

add('advanced', 'route-handlers',
	'How can a Route Handler under app/api/posts/[id]/route.ts be statically generated at build time for known ids?',
	'Export generateStaticParams from route.ts',
	['Add a page.tsx next to it that imports the handler',
	 'Export a getStaticPaths function from route.ts',
	 'Route Handlers can never be statically generated'],
	'generateStaticParams works for pages, layouts and Route Handlers, so GET responses for the returned params are produced at build time, while other params remain dynamic. getStaticPaths is the Pages Router API, and page.tsx cannot coexist with route.ts in a segment.');

add('advanced', 'navigation',
	'In Next.js 16, what happens to scroll-behavior: smooth that you set on <html> in global CSS during route transitions?',
	'No longer overridden, unless html has data-scroll-behavior="smooth"',
	['Next.js always disables smooth scrolling during navigations, with no opt-out',
	 'Next.js ignores your CSS and always smooth scrolls',
	 'It is removed from the CSS output at build time'],
	'Previously Next.js temporarily set scroll-behavior to auto during navigations so they felt instant, and restored it afterwards. That manipulation was costly, so 16 stops doing it by default. Add the data-scroll-behavior attribute on html if you want the earlier behavior.');

add('advanced', 'cli',
	'Which of these is a Next.js 16 minimum requirement?',
	'Node.js 20.9 or newer and TypeScript 5.1 or newer',
	['Node.js 18.18 and TypeScript 4.9',
	 'Node.js 22 and TypeScript 5.5',
	 'Node.js 20.9, but TypeScript is no longer supported'],
	'Next.js 16 dropped Node.js 18 and requires 20.9.0 (LTS) or newer, with TypeScript 5.1+ if you use TypeScript. Browser support moved to Chrome, Edge and Firefox 111 and Safari 16.4. Next.js 15 still ran on Node 18.18.');

export const nextQuestionsA = out;
