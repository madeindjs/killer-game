# Killer Game Generator - Agent Guide

A party game generator for creating Killer games where players eliminate each other through assigned tasks.

## Project Structure

```
killer-game/
├── api/          # Node.js backend (Fastify + Knex)
│   ├── src/      # API routes, controllers, services
│   │   └── mcp/  # Model Context Protocol integration (/mcp endpoint)
│   └── db/       # SQLite database
├── frontend/     # Next.js 19 frontend (React, TypeScript)
│   └── src/      # Pages, components, hooks
├── client/       # Shared client utilities
├── e2e/          # Playwright end-to-end suites (runnable against dev or prod)
└── types/        # Shared TypeScript types
```

## AI / MCP Integration

- `frontend/public/llms.txt` and `frontend/public/ai.txt` are served by Next.js for LLM agent discovery.
- `api/src/mcp/route.ts` exposes a stateful MCP endpoint at `/mcp` using `@modelcontextprotocol/sdk` v1 and Fastify.
- `api/src/server.ts` is TypeScript; `api/src/server.js` is a compatibility shim re-exporting it so existing `.js` route test files still work.

## Tech Stack

- **Frontend**: Next.js 19, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Knex.js (SQLite)
- **Tooling**: pnpm workspaces (version pinned via `packageManager`, use `corepack enable`), Docker, Docker Swarm

## TypeScript migration

The codebase is progressively migrating to TypeScript. Do **not** introduce `tsx`, `ts-node` or any other compile step. Prefer `node --experimental-strip-types`, which lets Node.js run `.ts` files directly after stripping type annotations.

### New files

Create new source files as `.ts` (or `.tsx` for React components and component tests in the frontend). This includes test files: a new frontend test must be `.test.tsx` (or `.test.ts` if it has no JSX), and a new backend/client test must be `.test.ts`. Never create new `.js`/`.jsx` source or test files.

### Existing `.js`/`.jsx` files

When you modify an existing `.js` or `.jsx` file, migrate it to `.ts`/`.tsx` as part of the same change (rename with `git mv` to preserve history, then add types). The migration must be incremental but complete for that file:

- Replace JSDoc type annotations (`@param`, `@returns`, `@type`, `@import`, etc.) with inline TypeScript types.
- Add explicit types for function parameters, return values, class properties and exported constants.
- Import shared types from `@killer-game/types` using regular or `type`-only imports.
- Keep imports of `.js`/`.jsx` modules extensionless (the bundler/Node resolves them); do not add `.js`/`.jsx` extensions to import paths.

### Erasable TypeScript syntax only

Only use syntax that `node --experimental-strip-types` can erase without transforming code:

- ✅ Type annotations, interfaces, type aliases, generics, `type` imports.
- ✅ `satisfies`, `as`, optional chaining, nullish coalescing.
- ❌ `enum`, `namespace`, parameter properties, decorators, legacy import aliases.

### Editor / type-check configuration

`jsconfig.json` files in the backend and client packages enable `checkJs` and `noEmit` with Node.js ESM (`module: "NodeNext"`, `moduleResolution: "NodeNext"`) and `allowImportingTsExtensions`. Keep these settings in sync when changing configurations.

### Running TypeScript

Backend and client scripts should be invoked with `node --experimental-strip-types` instead of `tsx` or `ts-node`. Existing `.js` tests still run with `node --test`; once a test file is migrated to `.ts`, invoke it with `node --experimental-strip-types --test`.

## Package manager

This repository uses **pnpm** (not npm). Workspaces are declared in `pnpm-workspace.yaml`, internal packages reference each other with `workspace:*`, and dependency overrides and the build-script allowlist (`allowBuilds`) also live in `pnpm-workspace.yaml`. Never commit a `package-lock.json`.

## Quick Start

```bash
pnpm install
pnpm dev           # Starts frontend + API

# Or with Docker
docker-compose up
```

## Key Commands

- `pnpm dev` - Development mode (frontend + API)
- `cd api && pnpm exec knex migrate:latest` - Run all pending database migrations (the API also runs them on startup)
- `cd api && pnpm test` - Run backend tests
- `cd frontend && pnpm test` - Run frontend tests
- `pnpm e2e` - Run the E2E suite against the local stack (started automatically if not running)
- `E2E_BASE_URL=https://the-killer.online pnpm e2e` - Run the E2E suite against production (`@dev-only` tests are skipped)
- `docker build . -f frontend.Dockerfile -t killer-frontend`
- `docker build . -f api.Dockerfile -t killer-api`

## Testing

After making changes to the API or frontend, always run the corresponding tests:

```bash
# Run all API tests
cd api && pnpm test

# Run all frontend tests
cd frontend && pnpm test

# Run the end-to-end suite (Playwright)
pnpm e2e
```

### End-to-end tests

`e2e/` holds Playwright suites covering every user-facing feature (see `e2e/README.md` for the feature map). Conventions:

- Each test creates its own data: use the `api` fixture (`api.createGame(...)`) or track games created through the UI with `games.trackFromUrl(page.url())`. Every tracked game is deleted when the test ends, so the suite can safely run against production.
- Use one browser context per participant (`newDevice()` fixture) for multi-user flows.
- Wait for hydration (`fillHydrated`, `waitForHydration`) before interacting with server-rendered forms.
- Prefer role/label/text selectors in English (`/en/...`); add accessible names to components rather than `data-testid` when a selector is missing.
- Tag tests with real external side effects (payments, leads) with `@dev-only`: they are skipped outside localhost.

**Important**: Before bumping dependencies, ensure comprehensive test coverage. After updating dependencies, always run the full test suite to catch breaking changes.

**Versioning Rule**: Every time you commit changes to a package (api, frontend, client, types), increment the version in its package.json (patch for fixes, minor for features, major for breaking changes) so it can be published with a new version.
