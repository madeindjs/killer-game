# Killer Game Generator - Agent Guide

A party game generator for creating Killer games where players eliminate each other through assigned tasks.

## Project Structure

```
killer-game/
├── api/          # Node.js backend (Express + Knex)
│   ├── src/      # API routes, controllers, services
│   └── db/       # SQLite database
├── frontend/     # Next.js 19 frontend (React, TypeScript)
│   └── src/      # Pages, components, hooks
├── client/       # Shared client utilities
└── types/        # Shared TypeScript types
```

## Tech Stack

- **Frontend**: Next.js 19, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Knex.js (SQLite)
- **Tooling**: npm workspaces, Docker, Docker Swarm

## TypeScript migration

The codebase is progressively migrating to TypeScript. Do **not** introduce `tsx`, `ts-node` or any other compile step. Prefer `node --experimental-strip-types`, which lets Node.js run `.ts` files directly after stripping type annotations.

### New files

Create new source files as `.ts` (or `.tsx` only for React components in the frontend).

### Existing `.js` files

When you modify an existing `.js` file, migrate it to `.ts` as part of the same change. The migration must be incremental but complete for that file:

- Replace JSDoc type annotations (`@param`, `@returns`, `@type`, `@import`, etc.) with inline TypeScript types.
- Add explicit types for function parameters, return values, class properties and exported constants.
- Import shared types from `@killer-game/types` using regular or `type`-only imports.

### Erasable TypeScript syntax only

Only use syntax that `node --experimental-strip-types` can erase without transforming code:

- ✅ Type annotations, interfaces, type aliases, generics, `type` imports.
- ✅ `satisfies`, `as`, optional chaining, nullish coalescing.
- ❌ `enum`, `namespace`, parameter properties, decorators, legacy import aliases.

### Editor / type-check configuration

`jsconfig.json` files in the backend and client packages enable `checkJs` and `noEmit` with Node.js ESM (`module: "NodeNext"`, `moduleResolution: "NodeNext"`) and `allowImportingTsExtensions`. Keep these settings in sync when changing configurations.

### Running TypeScript

Backend and client scripts should be invoked with `node --experimental-strip-types` instead of `tsx` or `ts-node`. Existing `.js` tests still run with `node --test`; once a test file is migrated to `.ts`, invoke it with `node --experimental-strip-types --test`.

## Quick Start

```bash
npm install
npm run dev        # Starts frontend + API

# Or with Docker
docker-compose up
```

## Key Commands

- `npm run dev` - Development mode (frontend + API)
- `cd api && npx knex migrate:up` - Run database migrations
- `cd api && npm test` - Run backend tests
- `cd frontend && npm test` - Run frontend tests
- `docker build . -f frontend.Dockerfile -t killer-frontend`
- `docker build . -f api.Dockerfile -t killer-api`

## Testing

After making changes to the API or frontend, always run the corresponding tests:

```bash
# Run all API tests
cd api && npm test

# Run all frontend tests
cd frontend && npm test
```

**Important**: Before bumping dependencies, ensure comprehensive test coverage. After updating dependencies, always run the full test suite to catch breaking changes.

**Versioning Rule**: Every time you commit changes to a package (api, frontend, client, types), increment the version in its package.json (patch for fixes, minor for features, major for breaking changes) so it can be published with a new version.
