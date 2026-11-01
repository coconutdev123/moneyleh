# What this is

MoneyLeh is a TypeScript monorepo. The current web app is built with React, Vite, and TypeScript; the backend uses Convex.

## Repository layout

- `apps/web/moneywhere` — React/Vite web application
- `apps/mobile` — reserved for the mobile application (not implemented yet)
- `packages/shared` — shared TypeScript utilities and UI primitives
- `packages/web_backend` — Convex schema, auth, and API functions
- `docs/oauth-setup.md` — Google/GitHub OAuth and Convex environment setup

## Install

From the repository root:

```bash
bun install
```

## Web app

Run the web app in development mode:

```bash
bun run dev:web
```

Build the web app:

```bash
bun run build:web
```

Other web-only checks and commands:

```bash
bun run typecheck:web
bun run lint:web
bun run preview:web
```

These root scripts target only the `moneywhere` workspace, so they do not run mobile or backend tasks.

## Mobile app

There is no mobile app package or build configured yet. The workspace includes `apps/*` so a mobile app placed directly in `apps/mobile` can be added as its own package, with separate root scripts such as `build:mobile` when its framework and build commands are established.

## Backend

The backend expects a Convex deployment and OAuth environment variables configured as described in `docs/oauth-setup.md`. Run Convex tooling from the `packages/web_backend` package as needed.
