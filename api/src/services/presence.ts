/**
 * In-memory registry of the players currently connected to a game (i.e. with
 * an open SSE stream). A player can have several connections (tabs, devices):
 * they stay online until the last one is closed.
 *
 * State is per API process and lost on restart, which is fine: clients
 * reconnect automatically and re-register.
 */
export class PresenceService {
  /** gameId -> playerId -> number of open connections */
  #connections = new Map<string, Map<string, number>>();

  /** @returns `true` if the player just came online */
  connect(gameId: string, playerId: string): boolean {
    let players = this.#connections.get(gameId);
    if (!players) {
      players = new Map();
      this.#connections.set(gameId, players);
    }

    const count = players.get(playerId) ?? 0;
    players.set(playerId, count + 1);
    return count === 0;
  }

  /** @returns `true` if the player just went offline */
  disconnect(gameId: string, playerId: string): boolean {
    const players = this.#connections.get(gameId);
    const count = players?.get(playerId);
    if (!players || !count) return false;

    if (count > 1) {
      players.set(playerId, count - 1);
      return false;
    }

    players.delete(playerId);
    if (players.size === 0) this.#connections.delete(gameId);
    return true;
  }

  getConnectedPlayerIds(gameId: string): string[] {
    return [...(this.#connections.get(gameId)?.keys() ?? [])];
  }
}
