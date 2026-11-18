/**
 * Target environment of the E2E run.
 *
 * - `E2E_BASE_URL`: frontend origin (default `http://localhost:3000`).
 * - `E2E_API_URL`: API origin. Derived from the frontend origin when omitted:
 *   `http://localhost:3000` → `http://localhost:3001`,
 *   `https://the-killer.online` → `https://api.the-killer.online`.
 */

const DEFAULT_BASE_URL = "http://localhost:3000";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Only keep the origin: `https://the-killer.online/en` → `https://the-killer.online`. */
function toOrigin(url: string): string {
  return new URL(url).origin;
}

export function deriveApiUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    url.port = "3001";
  } else {
    url.hostname = `api.${url.hostname.replace(/^www\./, "")}`;
  }
  return stripTrailingSlash(url.origin);
}

export const BASE_URL: string = toOrigin(process.env.E2E_BASE_URL ?? DEFAULT_BASE_URL);
export const API_URL: string = stripTrailingSlash(process.env.E2E_API_URL ?? deriveApiUrl(BASE_URL));

/** `true` when targeting a local stack, where side effects (payments, leads) are harmless. */
export const IS_LOCAL: boolean = ["localhost", "127.0.0.1"].includes(new URL(BASE_URL).hostname);

/** Prefix of every game created by the suite, so leftovers are easy to spot. */
export const GAME_NAME_PREFIX = "[E2E]";

/** File used by workers to record created games, consumed by the global teardown. */
export const GAMES_LEDGER_FILE: string = new URL("../.e2e-games.jsonl", import.meta.url).pathname;
