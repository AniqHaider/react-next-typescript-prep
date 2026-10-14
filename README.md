# react-next-typescript-prep

> **Windows?** See [SETUP-WINDOWS.md](SETUP-WINDOWS.md).

**500 multiple-choice questions** for React / Next.js / TypeScript interviews, in a small React 19 + Vite quiz app.
Every question has a self-contained explanation: why the right answer is right **and** why the tempting wrong ones fail.

| Topic | Questions | Covers |
|---|---|---|
| React | 200 | JSX, state, effects, refs, context, reducers, custom hooks — then React 19: Actions, `useActionState`, `useOptimistic`, `use()`, ref as a prop, Suspense, transitions, Server Components, the React Compiler, `<Activity>`, `useEffectEvent`, testing, a11y |
| Next.js | 200 | App Router (Next 15 / 16): file conventions, layouts, async `params`, metadata, images, route handlers — then caching, `'use cache'` / Cache Components, `revalidateTag` / `updateTag`, PPR, Server Actions & security, `proxy.ts`, auth, deployment, migrations |
| TypeScript | 100 | generics, utility / conditional / mapped / template-literal types, narrowing, discriminated unions, `satisfies`, `const` type params, tsconfig strictness, typing React props/hooks/events and Next params/metadata/actions |

Levels: basic · mid · advanced. Each question also carries a small topic tag (`hooks`, `caching`, `generics`, …).

```bash
bun install
bun run dev        # http://localhost:5175
bun run validate   # 500 questions, 4 distinct options each, explanations present, no duplicates
bun run check      # tsc --noEmit
bun run build
```

**Quiz modes** — Practice (explanation shown right after each pick) · Exam (no feedback until the end, then a full review).
**Missed questions** are remembered in `localStorage`, so you can retry only those.
Options are shuffled every attempt, so explanations never refer to A/B/C/D. Keys: `1`–`4` choose, `Enter` next.

## Adding questions
Questions live in `src/lib/questions/` (`react1.ts`, `react2.ts`, `next1.ts`, `next2.ts`, `typescript.ts`). Add one with
`add(level, tag, question, correct, [wrong1, wrong2, wrong3], why, code?)` and run `bun run validate`.
Ids are positional (`R01`, `RB07`, `N12`, …), so append rather than reorder if you want missed-question history to stay valid.

## Also in Kata
This bank is bundled in the **Kata** Android app ([`prep-pocket`](https://github.com/AniqHaider/prep-pocket), *React + Next + TS* section). The Kata copy is a Svelte port of this UI over the same question files.

> Version notes: written against React 19.x and Next.js 15/16. Framework behaviour changes quickly — if a question disagrees with the current docs, trust the docs and open an issue / fix the question.
