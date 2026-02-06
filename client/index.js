/**
 * @import  { SubscriberEventNames } from "@killer-game/types"
 */

export class KillerClient {
  /** @type {string} */
  host;

  /** @param {string} host */
  constructor(host) {
    this.host = host;
  }

  /**
   * @param {Pick<import("@killer-game/types").GameRecord, 'name'>} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async createGame(game) {
    return this.#fetchJson(`/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
  }

  /**
   * @param {import("@killer-game/types").GameRecord} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  updateGame(game) {
    return this.#fetchJson(`/games/${game.id}`, {
      method: "PUT",
      headers: {
        Authorization: game.private_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
  }

  /**
   * @param {import("@killer-game/types").GameRecord} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  deleteGame(game) {
    return this.#fetchJson(`/games/${game.id}`, {
      method: "DELETE",
      headers: {
        Authorization: game.private_token,
      },
    });
  }

  /**
   * @param {string} gameId
   * @param {string} [privateToken]
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  fetchGame(gameId, privateToken = undefined) {
    const headers = new Headers();
    if (privateToken) headers.set("Authorization", privateToken);

    return this.#fetchJson(`/games/${gameId}`, { headers });
  }

  /**
   * @param {string} gameId
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  createPlayer(gameId, player) {
    return this.#fetchJson(`/games/${gameId}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
  }

  /**
   * @param {string} playerId
   * @param {string} privateToken the `game.private_token` or the corresponding `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async fetchPlayer(playerId, privateToken) {
    return this.#fetchJson(`/players/${playerId}`, {
      method: "GET",
      headers: {
        Authorization: privateToken,
      },
    });
  }

  /**
   * Kill the next player given his `kill_token`
   * @param {string} playerId
   * @param {string} killToken the `player.kill_token` of the given `playerId`
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async killPlayer(playerId, killToken) {
    return this.#fetchJson(`/players/${playerId}/kill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kill_token: killToken }),
    });
  }

  /**
   * @param {string} playerId
   * @param {string} privateToken the `game.private_token` or the corresponding `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerStatus>}
   */
  async fetchPlayerStatus(playerId, privateToken) {
    return this.#fetchJson(`/players/${playerId}/status`, {
      method: "GET",
      headers: {
        Authorization: privateToken,
      },
    });
  }

  /**
   * @param {string} gameId
   * @param {import('@killer-game/types').PlayerUpdateDTO} player
   * @param {string} privateToken `game.private_token` or the corresponding `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  updatePlayer(gameId, player, privateToken) {
    return this.#fetchJson(`/games/${gameId}/players/${player.id}`, {
      method: "PUT",
      headers: {
        Authorization: privateToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...player,
        avatar:
          typeof player.avatar === "string"
            ? JSON.parse(player.avatar)
            : player.avatar,
      }),
    });
  }

  /**
   * @param {string} gameId
   * @param {string} playerId
   * @param {string} privateToken `game.private_token` or the corresponding `player.private_token`
   */
  async deletePlayer(gameId, playerId, privateToken) {
    const res = await fetch(
      `${this.host}/games/${gameId}/players/${playerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: privateToken,
        },
      },
    );

    if (!res.ok) throw Error();
  }

  /**
   * @param {string} playerId
   * @param {string} privateToken `player.private_token`
   * @param {string} targetId the player to kill
   * @param {string} killToken `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async killNextPlayer(playerId, privateToken, targetId, killToken) {
    return this.#fetchJson(`/players/${playerId}/kill`, {
      method: "POST",
      headers: {
        Authorization: privateToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kill_token: killToken, target_id: targetId }),
    });
  }

  /**
   * @param {string} gameId
   * @param {string} [privateToken]
   * @returns {Promise<import('@killer-game/types').PlayerRecord[]>}
   */
  async fetchPlayers(gameId, privateToken = undefined) {
    const headers = new Headers();
    if (privateToken) headers.set("Authorization", privateToken);

    return this.#fetchJson(`/games/${gameId}/players`, { headers });
  }

  /**
   * @param {string} gameId
   * @param {string} privateToken
   * @param {{displayAllPlayers?: boolean}} [opts]
   * @returns {Promise<import('@killer-game/types').GamePlayersTable>}
   */
  fetchPlayersTable(gameId, privateToken, opts = {}) {
    // @ts-expect-error
    const params = new URLSearchParams(opts);

    return this.#fetchJson(
      `/games/${gameId}/players/table?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: privateToken,
        },
      },
    );
  }

  /**
   * @param {string} gameId
   * @param {string} [privateToken] the `private_token` of the game or of the player
   * @returns {Promise<import('@killer-game/types').GameDashboard>}
   */
  fetchGameDashboard(gameId, privateToken) {
    const headers = new Headers();
    if (privateToken) headers.set("Authorization", privateToken);

    return this.#fetchJson(`/games/${gameId}/dashboard`, { headers });
  }

  /**
   * @returns {Promise<import("@killer-game/types").ApplicationStats>}
   */
  fetchApplicationStats() {
    return this.#fetchJson("/stats");
  }

  /**
   * @param {string} path
   * @param {RequestInit} [init]
   */
  async #fetchJson(path, init) {
    const res = await fetch(`${this.host}${path}`, {
      ...init,
      cache: "no-store",
    });

    if (!res.ok) throw Error();
    const { data } = await res.json();

    return data;
  }

  /**
   * @param {string} gameId
   * @param {(event: {event: keyof typeof SubscriberEventNames, payload: any}) => void} callback
   * @returns {() => void} the method to unsubscribe
   */
  setupGameListener(gameId, callback) {
    const evtSource = new EventSource(`${this.host}/games/${gameId}/sse`);

    evtSource.onmessage = (event) => {
      try {
        callback(JSON.parse(event.data));
      } catch (error) {
        console.error(error);
      }
    };

    return () => evtSource.close();
  }

  /**
   * @param {import("@killer-game/types").GameRecord} game
   */
  getGamePublicUrl(game, lang = "en") {
    const params = new URLSearchParams({ password: game.private_token });
    return `${this.#getPublicUrlLangPrefix(lang)}/games/${game.id}?${params}`;
  }

  /**
   * @param {import("@killer-game/types").GameRecord} game
   */
  getGameJoinPublicUrl(game, lang = "en") {
    return `${this.#getPublicUrlLangPrefix(lang)}/games/${game.id}/join`;
  }

  /**
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  getPlayerPublicUrl(player, lang = "en") {
    const params = new URLSearchParams({ password: player.private_token });
    return `${this.#getPublicUrlLangPrefix(lang)}/players/${player.id}?${params}`;
  }

  #getPublicUrlLangPrefix(lang = "en") {
    return lang ? `${this.host}/${lang}` : this.host;
  }
}
