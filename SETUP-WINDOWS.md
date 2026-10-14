# react-next-typescript-prep — Windows setup

A small React 19 + Vite quiz app with **500 multiple-choice questions** (200 React, 200 Next.js, 100 TypeScript) and
explanations. No backend, no database, no accounts.

> **Status.** Developed and tested on macOS (type-check, build, question validation). The Windows steps below follow
> each tool's official Windows docs and the project has no OS-specific code — but they have **not been run on a real
> Windows PC yet**. See *Troubleshooting* if something fails.

## 1. Install the tools (PowerShell)

```powershell
winget install --id Git.Git -e
winget install --id Oven-sh.Bun -e
winget install --id OpenJS.NodeJS.LTS -e      # recommended; required if you prefer npm
```

Close and reopen PowerShell, then check:

```powershell
git --version ; bun --version ; node --version
```

## 2. Get the code and run it

```powershell
mkdir C:\dev ; cd C:\dev
git clone https://github.com/AniqHaider/react-next-typescript-prep.git
cd react-next-typescript-prep
bun install
bun run dev
```

Open **http://localhost:5175**.

| Command | What it does |
|---|---|
| `bun run dev` | Dev server with hot reload on port **5175** |
| `bun run build` | Type-check + production build into `dist\` |
| `bun run preview` | Serve `dist\` on port 5175 |
| `bun run check` | `tsc --noEmit` — expect no output |
| `bun run validate` | Checks the bank: expect `total 500`, `react: 200`, `next: 200`, `typescript: 100`, then `OK` |

### No Bun? Use npm instead

```powershell
npm install
npm run dev        # dev / build / preview / check all work with npm
```

`npm run validate` needs Bun (it runs `bun scripts/validate.ts`); everything else doesn't.

## 3. Using the app

Pick topic / level / length / mode. *Practice* explains each answer right after you pick; *Exam* holds the explanations
until the end and gives a review. Options are shuffled each attempt. Keys: `1`–`4` choose, `Enter` next. Missed
questions are stored in the browser's **localStorage** for `http://localhost:5175` — per browser and per port, not
carried over from your old machine.

## 4. Editing the content

Questions live in `src\lib\questions\` (`react1.ts`, `react2.ts`, `next1.ts`, `next2.ts`, `typescript.ts`). Add one with
`add(level, tag, question, correct, [wrong1, wrong2, wrong3], why, code?)`, then run `bun run validate`.

## 5. Notes

- **TypeScript is pinned to `~6`** in `package.json`; bump it only after `bun run check` and `bun run build` pass.
- This bank is also bundled inside the **Kata** Android app (`prep-pocket` repo) — you don't need both.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `bun` / `node` "not recognized" | Close and reopen PowerShell so PATH refreshes. |
| Port 5175 already in use | `bun run dev -- --port 5180` |
| Page shows old content after edits | Hard refresh (Ctrl+Shift+R). |
| Build warns about chunks > 500 kB | Expected (the whole question bank ships in one bundle); safe to ignore. |
