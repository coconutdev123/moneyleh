What this is

This repo is a TypeScript monorepo for a web app with OAuth-backed authentication, a protected dashboard, and a Convex-powered backend for user profiles and auth flows. The documentation describes it as an AI Job Application Assistant Platform, and the app code reflects that shape: sign-in/sign-up pages, a dashboard route, and profile APIs.

Stack
Language(s): TypeScript
Framework / runtime: Vite + React 19 for the web app; Convex for the backend/auth layer
Notable libraries: React Router, Convex auth, shadcn-style UI primitives, Tailwind CSS, and the Auth.js/Convex auth integration
How it's organized

apps/
  web/
    moneywhere/    Vite/React app, routing, auth screens, dashboard
docs/
  oauth-setup.md  Google/GitHub OAuth and Convex env setup
packages/
  shared/          shared TS utilities and reusable UI primitives
  web_backend/     Convex backend, schema, auth, profile HTTP routes

How it fits together: The frontend app in apps/web/moneywhere sets up routes for /sign-in, /sign-up, /forgot-password, /confirmation, and a protected /dashboard behind a PrivateRoute. The backend package uses Convex to define auth and profile behavior (auth.ts, schema.ts, http.ts, profile.ts), and the docs explain how to wire Google/GitHub OAuth credentials into Convex environment variables. packages/shared is the small reusable UI layer for things like buttons and styling utilities.

How to run it
Fresh clone path, based on the repo’s package/workspace setup and the app scripts:

bash
# install the workspace dependencies
bun install

# run the frontend app
cd apps/web/moneywhere
bun run dev

For the backend/auth side, this repo expects a Convex deployment and the OAuth env vars described in docs/oauth-setup.md to be configured in the Convex Dashboard. In practice, the backend is meant to be run through Convex tooling rather than a local Node server script.

