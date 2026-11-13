# BookNook client (`book_nook`)

Next.js 16 App Router storefront. JavaScript only (no TypeScript); UI is shadcn `base-nova` on Base UI.

## Commands

Run from this directory with npm (`package-lock.json`). Node 22+ is required by the `cn` package (local Node is 24).

- `npm run dev` — dev server (Turbopack; the default in Next 16).
- `npm run build` — full verification; currently passes.
- `npm run lint` — ESLint flat config. Single file: `npx eslint src/path/file.jsx`.
- No test, typecheck, format, or CI scripts/config exist.

Lint baseline: do not treat these as regressions or try to "fix" them as part of unrelated work:

- `src/components/ui/carousel.jsx:74` and `src/hooks/use-mobile.js:14` — real pre-existing `react-hooks/set-state-in-effect` errors.
- 12 more errors come from a stale untracked copy of build output at `Assignment/B14-A8/BookNook_Client/book_nook/.next/` (11 junk files). Nothing ignores it, so `npm run lint` reports 14 errors. Delete `Assignment/` or lint `src/` directly before judging a change.

## Framework gotchas

- `next.config.mjs` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`, and the `@tailwindcss/turbopack` CSS loader.
- Cache Components rejects route segment configs (`dynamic`, `revalidate`, `fetchCache`, `runtime`) with build errors. For request-time data, `await io()` from `next/cache` in a Server Component wrapped in `<Suspense>` (see `src/components/home/new-arrivals.jsx`); use `"use cache"` / `cacheLife` for cacheable data.
- Read `node_modules/next/dist/docs/` before adding routes, data fetching, or caching. The installed version is Next 16.4.6 and differs from older training data. Start with `01-app/02-guides/migrating-to-cache-components.md`, `adopting-partial-prefetching.md`, `authentication-with-cache-components.md`, and `01-app/03-api-reference/04-functions/io.md`.
- Tailwind CSS v4 has no config file: `src/app/globals.css` imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and Swiper CSS. Do not add `tailwind.config.*` or PostCSS config.
- Build warns that `C:\Projects\package-lock.json` is outside this Git repo and was ignored. Harmless; set `turbopack.root` only if caching/tracing misbehaves.

## Env and data

- `.env` is gitignored but present locally; `.env.example` lists the shape. Keys actually used: `MONGODB_URI`, `MONGODB_DB`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, optional `IMGBB_API_KEY` (or the `NEXT_PUBLIC_IMGBB_API_KEY` fallback) for book covers, and optionally `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Never print, copy, or commit the secrets in `.env`.
- MongoDB access goes through `src/lib/mongodb.js`; DB name defaults to `booknook` (`MONGODB_DB`). `src/lib/auth.js` uses the same default DB so auth users and books share one database.
- `getLatestBooks` (`src/lib/books.js`) silently falls back to `demoBooks` when `MONGODB_URI` is missing, the `books` collection is empty, or the query fails. Home's "New Arrivals" is the only page using the demo fallback.
- `/add-book` is implemented: `AddBookForm` posts multipart images to `/api/upload` and book JSON to `/api/books`, which re-checks the better-auth session and inserts into `books` via `createBook`. `/api/upload` uses ImgBB when a key works; otherwise it stores the cover in the `bookImages` collection and returns `/api/images/<id>`. `/all-books` redirects to the public `/books` route, which lists saved books; `my-books` and `my-borrows` are still placeholder `EmptyState` pages.

## Auth

- better-auth is wired end to end: `src/lib/auth.js` configures the Mongo adapter (same `booknook` DB, falling back to an in-memory adapter when `MONGODB_URI` is absent), enforces the password rules server-side, and enables Google only when both Google env vars exist.
- `AuthProvider` subscribes to `authClient.useSession()`, so `useAuth()` exposes the better-auth user, `isLoaded`, `isAuthenticated`, and `async logout()`. Login/register pages call `authClient` directly.
- Private routes use `RequireAuth`, which redirects to `/login?next=<pathname>`; the login page validates and returns to that path. Use the helpers in `src/lib/auth-redirect.js` instead of hand-building these URLs.
- Registration signs the user out after better-auth creates the session, then sends them to `/login?registered=1` so login is always the next step.
- Password rules live in `src/lib/password.js` (6+ chars, one uppercase, one lowercase) and are shared by the form and the `hooks.before` check in `src/lib/auth.js`.
- The Google buttons call `authClient.signIn.social({ provider: "google", callbackURL })`; without `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` the server returns 404 and the UI shows a configuration error.
- `src/components/auth/auth-form.jsx` is a working reusable form, but the live `/login` and `/register` pages render their own forms.
- `src/lib/auth-store.js` is the old localStorage mock and is no longer imported. Do not reintroduce it; it will disagree with the real session.

## UI conventions

- Base UI primitives, not Radix: pass `render={<Component />}` instead of `asChild`; follow the patterns in `src/components/ui/`.
- Add primitives with `npx shadcn@latest add <component>` rather than hand-writing them (`components.json`: `tsx: false`, style `base-nova`).
- Import `cn` from the `cn` package (`import { cn } from "cn"`); `@/lib/utils` only re-exports it. Both import styles exist in the codebase.
- Use the `@/*` alias mapped to `src/*` (`jsconfig.json`).
- Standard pages use `PageShell` plus an exported `metadata` object; icons are `lucide-react`.

## Layout

- `src/app/` — App Router routes; root layout wraps every page in `AuthProvider`, `Navbar`, and `Footer`.
- `src/components/home|auth|layout/` — feature components; `src/components/ui/` — generated shadcn/Base UI primitives.
- `src/hooks/`, `src/lib/` — shared hooks and utilities.
- `README.md` is stale `create-next-app` boilerplate (it references `app/page.js`); trust `src/`.

## Repo and git

- The Git root is now this directory (verify with `git rev-parse --show-toplevel`), not `C:\Projects` as older notes claimed.
- `Assignment/` is untracked leftover build output. Do not run `git add -A` until it is deleted or ignored; stage files explicitly.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
