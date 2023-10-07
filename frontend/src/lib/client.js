import { SubscriberEventNames } from "@killer-game/types";

/**
 * @param {Pick<GameRecord, 'name'>} game
 * @returns {Promise<import('@killer-game/types').GameRecord>}
 */
export async function createGame(game) {
  const res = await fetch("http://localhost:3001/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!res.ok) throw Error();

  const { data } = await res.json();

  return data;
}

/**
 * @param {string} gameId
 * @param {string} [privateToken]
 * @returns {Promise<import('@killer-game/types').GameRecord>}
 */
export async function fetchGame(gameId, privateToken = undefined) {
  const res = await fetch(`http://localhost:3001/games/${gameId}`, {
    method: "GET",
    headers: {
      Authorization: privateToken,
    },
  });

  if (!res.ok) throw Error();
  const { data } = await res.json();
  return data;
}

/**
 * @param {string} gameId
 * @param {Pick<import('@killer-game/types').PlayerRecord, 'name'>} player
 * @returns {Promise<import('@killer-game/types').PlayerRecord>}
 */
export async function createPlayer(gameId, player) {
  const res = await fetch(`http://localhost:3001/games/${gameId}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!res.ok) throw Error();

  const { data } = await res.json();

  return data;
}

/**
 * @param {string} gameId
 * @param {string} [privateToken]
 * @returns {Promise<import('@killer-game/types').PlayerRecord[]>}
 */
export async function fetchPlayers(gameId, privateToken = undefined) {
  const res = await fetch(`http://localhost:3001/games/${gameId}/players`, {
    method: "GET",
    headers: {
      Authorization: privateToken,
    },
  });

  if (!res.ok) throw Error();
  const { data } = await res.json();
  return data;
}

/**
 * @typedef GameListenerCallbacks
 * @property {(player: Player) => void} [onPlayerCreated]
 */

/**
 * @param {string} gameId
 * @param {GameListenerCallbacks} param0
 * @returns {() => void} the method to unsubscribe
 */
export function useGameListener(gameId, { onPlayerCreated }) {
  const evtSource = new EventSource(`http://localhost:3001/games/${gameId}/sse`);

  function onSseEvent(event) {
    switch (event.event) {
      case SubscriberEventNames.PlayerCreated:
        return onPlayerCreated?.(event.payload);
    }
  }

  evtSource.onmessage = (event) => {
    try {
      onSseEvent(JSON.parse(event.data));
    } catch (error) {
      console.error(error);
    }
  };

  return () => evtSource.close();
}
