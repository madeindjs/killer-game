import assert from "node:assert";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { GameRecord, PlayerRecord } from "@killer-game/types";
import { useServer, type UseServerReturn } from "../server.ts";
import { getGamesSSeRoute } from "./games-sse.ts";

interface SseMessage {
  event: string;
  payload: any;
}

/** A live SSE connection reading `data:` messages as they arrive. */
class SseClient {
  #controller = new AbortController();
  #messages: SseMessage[] = [];
  #waiters: Array<() => void> = [];
  ready: Promise<void>;

  constructor(url: string) {
    this.ready = fetch(url, { signal: this.#controller.signal }).then((res) => {
      void this.#read(res.body!.getReader());
    });
  }

  async #read(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) return;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const data = chunk.split("\n").find((line) => line.startsWith("data:"));
          if (!data) continue;
          this.#messages.push(JSON.parse(data.slice("data:".length)));
          this.#waiters.forEach((w) => w());
        }
      }
    } catch {
      // aborted
    }
  }

  /** Wait for the first message (already received or not) matching the predicate. */
  waitFor(predicate: (m: SseMessage) => boolean, timeoutMs = 2000): Promise<SseMessage> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("SSE message not received")), timeoutMs);
      const check = () => {
        const index = this.#messages.findIndex(predicate);
        if (index === -1) return;
        const [message] = this.#messages.splice(0, index + 1).slice(-1);
        clearTimeout(timer);
        this.#waiters = this.#waiters.filter((w) => w !== check);
        resolve(message);
      };
      this.#waiters.push(check);
      check();
    });
  }

  close() {
    this.#controller.abort();
  }
}

const isPresence = (m: SseMessage) => m.event === "PlayerPresence";

describe(getGamesSSeRoute.name, () => {
  let server: UseServerReturn;
  let baseUrl: string;
  let game: GameRecord;
  let player: PlayerRecord;
  const clients: SseClient[] = [];

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
    await server.server.listen({ port: 0, host: "127.0.0.1" });
    const { port } = server.server.server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;

    game = await server.container.gameService.create({ name: "test" });
    player = await server.container.playerService.create({ name: "Alice", game_id: game.id, action: "wink" });
  });

  afterEach(async () => {
    clients.splice(0).forEach((c) => c.close());
    await server.close();
  });

  function connect(query: Record<string, string> = {}): SseClient {
    const params = new URLSearchParams(query);
    const client = new SseClient(`${baseUrl}/games/${game.id}/sse?${params}`);
    clients.push(client);
    return client;
  }

  it("should return 404 for an unknown game", async () => {
    const res = await fetch(`${baseUrl}/games/unknown/sse`);
    assert.strictEqual(res.status, 404);
  });

  it("should forward game events", async () => {
    const organizer = connect();
    await organizer.waitFor(isPresence);

    await server.container.gameService.update({ ...game, name: "updated" });

    const message = await organizer.waitFor((m) => m.event === "GameUpdated");
    assert.strictEqual(message.payload.name, "updated");
  });

  it("should send the connected players right after connecting", async () => {
    const organizer = connect();

    const message = await organizer.waitFor(isPresence);
    assert.deepStrictEqual(message.payload, { connected_player_ids: [] });
  });

  it("should broadcast when a player connects and disconnects", async () => {
    const organizer = connect();
    await organizer.waitFor(isPresence);

    const playerClient = connect({ player_id: player.id, token: player.private_token });

    const online = await organizer.waitFor(isPresence);
    assert.deepStrictEqual(online.payload, { connected_player_ids: [player.id] });

    playerClient.close();

    const offline = await organizer.waitFor(isPresence);
    assert.deepStrictEqual(offline.payload, { connected_player_ids: [] });
  });

  it("should not mark a player connected with a wrong token", async () => {
    const intruder = connect({ player_id: player.id, token: "wrong" });

    const message = await intruder.waitFor(isPresence);
    assert.deepStrictEqual(message.payload, { connected_player_ids: [] });
    assert.deepStrictEqual(server.container.presenceService.getConnectedPlayerIds(game.id), []);
  });

  it("should not mark a player connected to another game", async () => {
    const otherGame = await server.container.gameService.create({ name: "other" });
    const client = new SseClient(
      `${baseUrl}/games/${otherGame.id}/sse?${new URLSearchParams({ player_id: player.id, token: player.private_token })}`,
    );
    clients.push(client);

    await client.waitFor(isPresence);
    assert.deepStrictEqual(server.container.presenceService.getConnectedPlayerIds(otherGame.id), []);
  });
});
