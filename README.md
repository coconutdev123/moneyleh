# What this is

MoneyLeh is a TypeScript monorepo. The current web app is built with React, Vite, and TypeScript; the backend uses Convex.

## Repository layout

- `apps/web/moneywhere` — React/Vite web application
- `apps/mobile` — Expo + React Native mobile application
- `packages/shared` — shared TypeScript utilities and UI primitives
- `packages/backend` — Convex schema, auth, and API functions
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

The Expo + React Native app lives in `apps/mobile` and is a separate Bun workspace package. It includes a password sign-in/sign-up flow and mobile screens for the dashboard, expense entry, wishlist, and spending overview.

Expo SDK 58 requires Node.js 22.13 or newer; `.nvmrc` selects the Node 22 release line. Set `EXPO_PUBLIC_CONVEX_URL` in `apps/mobile/.env.local` to your Convex deployment URL before starting. Expo automatically loads this standard environment filename.

```bash
bun install
bun run start:mobile
```

For a web preview of the mobile layout, run:

```bash
bun run web:mobile
```

The mobile app stores auth tokens using Expo SecureStore on iOS and Android. The sign-in flow currently uses email and password; Google sign-in is not yet wired to mobile deep links.

Open the app on a connected Android or iOS simulator/device:

```bash
bun run android:mobile
bun run ios:mobile
```

You can also run `bun run typecheck:mobile` and `bun run lint:mobile` for mobile-only checks. For a fresh clone, run `bun install` from the repository root first. The Expo Go app can open the development QR code; local simulator commands require the relevant Android or iOS tooling.

Native installable builds are not configured yet. Set up an EAS project and build profiles before adding a `build:mobile` command; Expo's development server is for previewing and testing, not producing signed store binaries.

## Backend

The backend expects a Convex deployment and OAuth environment variables configured as described in `docs/oauth-setup.md`. Run Convex tooling from the `packages/backend` package as needed.
