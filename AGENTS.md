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
