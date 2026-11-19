# End-to-end tests

Playwright suites covering every user-facing feature of the Killer game. They
drive real browsers (one browser context per participant) against a running
environment: your local stack or production.

## Running

```bash
corepack enable && pnpm install
pnpm --filter @killer-game/e2e exec playwright install chromium

# local stack (http://localhost:3000 + API on :3001); started automatically if not running
pnpm e2e

# production (API derived as https://api.the-killer.online)
E2E_BASE_URL=https://the-killer.online pnpm e2e
# or: pnpm e2e:prod

# a single spec / project, or the interactive UI
pnpm --filter @killer-game/e2e test tests/game-flow.spec.ts --project=desktop
pnpm --filter @killer-game/e2e test:ui
```

| Variable               | Default                                  | Description                                        |
| ---------------------- | ---------------------------------------- | -------------------------------------------------- |
| `E2E_BASE_URL`         | `http://localhost:3000`                  | Frontend under test (only the origin is used)      |
| `E2E_API_URL`          | derived (`:3001` locally, `api.` remote) | API used by the setup shortcuts and the cleanup    |
| `E2E_API_COMMAND`      | `pnpm --filter @killer-game/api dev`     | Command starting the API when testing localhost    |
| `E2E_FRONTEND_COMMAND` | `pnpm --filter @killer-game/frontend dev`| Command starting the frontend when testing localhost |

The report is written to `e2e/playwright-report` (`pnpm --filter @killer-game/e2e report`).

## Data cleanup

Every game created by a test is deleted at the end of that test, whether it
passed or failed:

- games created with the `api` fixture are tracked automatically;
- games created through the UI must be tracked with `games.trackFromUrl(page.url())`;
- cleanup deletes the players, then the game;
- every tracked game is also written to `e2e/.e2e-games.jsonl`. The global teardown deletes whatever is left (crashed worker, API down…) and keeps the games it could not delete for the next run.

Game names start with `[E2E]` so leftovers are easy to spot.

## Production safety

Tests with real external side effects are tagged `@dev-only` and skipped when
the target is not localhost:

- the team-building lead submission (sends a message to the sales Matrix room);
- the premium upgrade (Stripe Checkout; the session creation is intercepted anyway).

Running against production still creates (then deletes) a few games per run
and triggers the ntfy notifications of game start/finish/deletion. The
Playwright config limits workers to 2 and retries flaky network tests.

## Feature map

| Feature                                                                       | Spec                     |
| ----------------------------------------------------------------------------- | ------------------------ |
| Landing page (hero, create form, how it works, stats, testimonials), footer   | `marketing.spec.ts`      |
| Content pages (`/help`, `/actions`, `/team-building`, `/docs/ai`), 404        | `marketing.spec.ts`      |
| `robots.txt`, `sitemap.xml`, `llms.txt`, `ai.txt`                             | `marketing.spec.ts`      |
| Team building lead form: validation, submission (`@dev-only`)                 | `marketing.spec.ts`      |
| Locale redirect, French invitation, language switcher                         | `i18n.spec.ts`           |
| Create a game from the home page, admin dashboard empty state                 | `game-lifecycle.spec.ts` |
| Rename / delete a game, settings locked once started                          | `game-lifecycle.spec.ts` |
| Add players (empty state, invite modal), edit / remove a player               | `players.spec.ts`        |
| Avatar picture upload / removal, avatar editor                                | `players.spec.ts`        |
| Invitation link `/join/:slug`, QR code, join form, started / unknown game     | `join.spec.ts`           |
| Live join + toast, presence ("X/Y connected"), lobby, rename, start (SSE)     | `realtime.spec.ts`       |
| Start disabled < 2 players, start modal (links, shuffle), pause               | `game-flow.spec.ts`      |
| Elimination via the QR kill link, target inheritance, podium/events, game end | `game-flow.spec.ts`      |
| Forged / reused kill links                                                    | `game-flow.spec.ts`      |
| Games created on this device (`/games`), "Join a game"                        | `games-list.spec.ts`     |
| Admin / player pages need their private token, API auth, no secret leaks      | `security.spec.ts`       |
| Premium checkout redirect and return messages (`@dev-only`)                   | `premium.spec.ts`        |
| `/stats`, Swagger `/docs`, MCP server (`/mcp`) tools                          | `api.spec.ts`            |

Known gap (`test.fixme`): games joined on a device are never recorded, so the
"Games joined" section of `/games` is always empty.

The `mobile` project (Pixel 7) re-runs the participant-facing specs
(`join`, `realtime`, `game-flow`).
