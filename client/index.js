import { SubscriberEventNames } from "@killer-game/types";

export class KillerClient {
  /** @type {string} */
  host;

  /**
   * @param {string} host
   */
  constructor(host) {
    this.host = host;
  }

  /**
   * @param {Pick<import("@killer-game/types").GameRecord, 'name'>} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async createGame(game) {
    const res = await fetch("${this.host}/games", {
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
   * @param {import("@killer-game/types").GameRecord} game
   * @returns {Promise<import('@killer-game/types').GameRecord>}
   */
  async updateGame(game) {
    const res = await fetch(`${this.host}/games/${game.id}`, {
      method: "PUT",
      headers: {
        Authorization: game.private_token,
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
  async fetchGame(gameId, privateToken = undefined) {
    const res = await fetch(`${this.host}/games/${gameId}`, {
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
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async createPlayer(gameId, player) {
    const res = await fetch(`${this.host}/games/${gameId}/players`, {
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
   * @param {string} playerId
   * @param {string} privateToken the `game.private_token` or the corresponding `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async fetchPlayer(playerId, privateToken) {
    const res = await fetch(`${this.host}/players/${playerId}`, {
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
   * @param {string} playerId
   * @param {string} privateToken the `game.private_token` or the corresponding `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerStatus>}
   */
  async fetchPlayerStatus(playerId, privateToken) {
    const res = await fetch(`${this.host}/players/${playerId}/status`, {
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
   * @param {import('@killer-game/types').PlayerCreateDTO} player
   * @param {string} privateToken `game.private_token` or the corresponding `player.private_token`
   * @returns {Promise<import('@killer-game/types').PlayerRecord>}
   */
  async updatePlayer(gameId, player, privateToken) {
    const res = await fetch(`${this.host}/games/${gameId}/players/${player.id}`, {
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

    if (!res.ok) throw Error();

    const { data } = await res.json();

    return data;
  }

  /**
   * @param {string} gameId
   * @param {string} playerId
   * @param {string} privateToken `game.private_token` or the corresponding `player.private_token`
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
   * @param {string} gameId
   * @param {string} [privateToken]
   * @returns {Promise<import('@killer-game/types').PlayerRecord[]>}
   */
  async fetchPlayers(gameId, privateToken = undefined) {
    const res = await fetch(`${this.host}/games/${gameId}/players`, {
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
   * @property {(player: Player) => void} [onPlayerUpdated]
   * @property {(player: Player) => void} [onPlayerDeleted]
   */

  /**
   * @param {string} gameId
   * @param {GameListenerCallbacks} param0
   * @returns {() => void} the method to unsubscribe
   */
  setupGameListener(gameId, { onPlayerCreated, onPlayerUpdated, onPlayerDeleted }) {
    const evtSource = new EventSource(`${this.host}/games/${gameId}/sse`);

    function onSseEvent(event) {
      switch (event.event) {
        case SubscriberEventNames.GameCreated:
          break;
        case SubscriberEventNames.GameUpdated:
          break;
        case SubscriberEventNames.GameDeleted:
          break;
        case SubscriberEventNames.PlayerCreated:
          return onPlayerCreated?.(event.payload);
        case SubscriberEventNames.PlayerUpdated:
          return onPlayerUpdated?.(event.payload);
        case SubscriberEventNames.PlayerDeleted:
          return onPlayerDeleted?.(event.payload);
          break;
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

  /**
   * @param {string} gameId
   * @param {(event: {event: keyof typeof SubscriberEventNames, payload: any}) => void}
   * @returns {() => void} the method to unsubscribe
   */
  setupGameListener2(gameId, callback) {
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
}
