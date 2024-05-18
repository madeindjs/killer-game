import { KillerClient } from "@killer-game/client";

const client = new KillerClient("https://the-killer.online");

/**
 * @param {string} message
 * @param {string} topic
 */
export function ntfy(message, topic = `the-killer-online-v2_${process.env.NODE_ENV}`) {
  if (!["production", "development"].includes(String(process.env.NODE_ENV))) return;
  return fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    body: message,
  }).catch(() => {});
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function ntfyGameCreated(game) {
  const url = client.getGamePublicUrl(game);
  return ntfy(`[GAME] created ${url}`);
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 */
export function ntfyGameDeleted(game) {
  const url = client.getGamePublicUrl(game);
  return ntfy(`[GAME] deleted ${url}`);
}

/**
 * @param {import("@killer-game/types").GameRecord} game
 * @param {import("@killer-game/types").PlayerRecord[]} players
 */
export function ntfyGameStarted(game, players) {
  const url = client.getGamePublicUrl(game);
  return ntfy(`[GAME] started with ${players.length} players - ${url}`);
}

export function ntfyGameFinished(game, players) {
  const url = client.getGamePublicUrl(game);
  return ntfy(`[GAME] finished with ${players.length} players - ${url}`);
}
