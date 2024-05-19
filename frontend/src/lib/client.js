/**
 * @import { GameActionsRecord,GameRecord, PlayerRecord } from '@/models'
 */

export class KillerClient {
  /** @type {string} */
  host;

  constructor(host = "/api/v1") {
    this.host = host;
  }

  /**
   * @param {Pick<GameRecord, 'name'>} game
   * @returns {Promise<Games>}
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
   * @param {GameRecord} game
   * @returns {Promise<GameRecord>}
   */
  updateGame(game) {
    return this.#fetchJson(`/games/${game.id}`, {
      method: "PUT",
      headers: {
        Authorization: game.privateToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
  }

  /**
   * @param {GameRecord} game
   * @returns {Promise<GameRecord>}
   */
  deleteGame(game) {
    return this.#fetchJson(`/games/${game.id}`, {
      method: "DELETE",
      headers: {
        Authorization: game.privateToken,
      },
    });
  }

  /**
   * @param {string} gameId
   * @param {string} [privateToken]
   * @returns {Promise<GameRecord>}
   */
  fetchGame(gameId, privateToken = undefined) {
    return this.#fetchJson(`/games/${gameId}`, {
      method: "GET",
      headers: {
        Authorization: privateToken,
      },
    });
  }

  /**
   * @param {string} gameId
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   * @returns {Promise<PlayerRecord>}
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
   * @param {string} privateToken the `game.privateToken` or the corresponding `player.privateToken`
   * @returns {Promise<PlayerRecord>}
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
   * @param {string} playerId
   * @param {string} privateToken the `game.privateToken` or the corresponding `player.privateToken`
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
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   * @param {string} privateToken `game.privateToken` or the corresponding `player.privateToken`
   * @returns {Promise<PlayerRecord>}
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
        avatar: typeof player.avatar === "string" ? JSON.parse(player.avatar) : player.avatar,
      }),
    });
  }

  /**
   * @param {string} gameId
   * @param {string} playerId
   * @param {string} privateToken `game.privateToken` or the corresponding `player.privateToken`
   */
  async deletePlayer(gameId, playerId, privateToken) {
    const res = await fetch(`${this.host}/games/${gameId}/players/${playerId}`, {
      method: "DELETE",
      headers: {
        Authorization: privateToken,
      },
    });

    if (!res.ok) throw Error();
  }

  /**
   * @param {string} playerId
   * @param {string} privateToken `player.privateToken`
   * @param {string} targetId the player to kill
   * @param {string} killToken `player.privateToken`
   * @returns {Promise<PlayerRecord>}
   */
  async killPlayer(playerId, privateToken, targetId, killToken) {
    return this.#fetchJson(`/players/${playerId}/kill`, {
      method: "POST",
      headers: {
        Authorization: privateToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ killToken: killToken, target_id: targetId }),
    });
  }

  /**
   * @param {string} gameId
   * @param {string} [privateToken]
   * @returns {Promise<PlayerRecord[]>}
   */
  async fetchPlayers(gameId, privateToken = undefined) {
    return this.#fetchJson(`/games/${gameId}/players`, {
      method: "GET",
      headers: {
        Authorization: privateToken,
      },
    });
  }

  /**
   * @param {string} gameId
   * @param {string} privateToken
   * @param {{displayAllPlayers?: boolean}} [opts]
   * @returns {Promise<import('@killer-game/types').GamePlayersTable>}
   */
  fetchPlayersTable(gameId, privateToken, opts = {}) {
    const params = new URLSearchParams(opts);

    return this.#fetchJson(`/games/${gameId}/players/table?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: privateToken,
      },
    });
  }

  /**
   * @param {string} gameId
   * @param {string} [privateToken] the `privateToken` of the game or of the player
   * @returns {Promise<import('@killer-game/types').GameDashboard>}
   */
  fetchGameDashboard(gameId, privateToken) {
    return this.#fetchJson(`/games/${gameId}/dashboard`, {
      method: "GET",
      headers: {
        Authorization: privateToken,
      },
    });
  }

  /**
   * @param {string} path
   * @param {RequestInit} [init]
   */
  async #fetchJson(path, init) {
    const res = await fetch(`${this.host}${path}`, init);

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
   * @param {GameRecord} game
   */
  getGamePublicUrl(game, lang = "") {
    const params = new URLSearchParams({ password: game.privateToken });
    return `${this.#getPublicUrlLangPrefix(lang)}/games/${game.id}?${params}`;
  }

  /**
   * @param {GameRecord} game
   */
  getGameJoinPublicUrl(game, lang = "") {
    return `${this.#getPublicUrlLangPrefix(lang)}/games/${game.id}/join`;
  }

  /**
   * @param {import("@killer-game/types").PlayerRecord} player
   */
  getPlayerPublicUrl(player, lang = "") {
    const params = new URLSearchParams({ password: player.privateToken });
    return `${this.#getPublicUrlLangPrefix(lang)}/players/${player.id}?${params}`;
  }

  #getPublicUrlLangPrefix(lang) {
    return lang ? `${this.host}/${lang}` : this.host;
  }
}

export const client = new KillerClient("/api/v1");
export const client2 = new KillerClient(`/api/v1/`);
