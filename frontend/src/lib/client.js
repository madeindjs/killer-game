import "../model";

/**
 * @param {Pick<GameRecord, 'name'>} game
 * @returns {Promise<GameRecord>}
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
 * @returns {Promise<GameRecord>}
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
 * @param {Pick<PlayerRecord, 'name'>} player
 * @returns {Promise<PlayerRecord>}
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
 * @returns {Promise<PlayerRecord[]>}
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
