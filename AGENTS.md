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
- `docker build . -f frontend.Dockerfile -t killer-frontend`
- `docker build . -f api.Dockerfile -t killer-api`
