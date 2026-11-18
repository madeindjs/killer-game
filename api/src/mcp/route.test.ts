import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { useServer, type UseServerReturn } from "../server.ts";

function parseSseJson(payload: string): unknown {
  const match = payload.match(/data: (.+)/);
  return JSON.parse(match?.[1] ?? "{}");
}

async function mcpPost(
  server: UseServerReturn,
  body: object,
  sessionId?: string,
  extraHeaders: Record<string, string> = {},
): Promise<{ statusCode: number; payload: string; headers: Record<string, string | string[] | undefined> }> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
    ...extraHeaders,
  };
  if (sessionId) headers["mcp-session-id"] = sessionId;

  const response = await server.server.inject({
    method: "POST",
    url: "/mcp",
    headers,
    body: JSON.stringify(body),
  });
  return { statusCode: response.statusCode, payload: response.payload ?? "", headers: response.headers };
}

describe("MCP endpoint", () => {
  let server: UseServerReturn;

  beforeEach(async () => {
    server = await useServer("test");
    await server.container.db.migrate.latest();
  });

  afterEach(async () => {
    await server.close();
  });

  it("lists expected tools", async () => {
    const init = await mcpPost(server, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0.0" },
      },
    });
    assert.strictEqual(init.statusCode, 200);
    const initData = parseSseJson(init.payload) as { result?: { serverInfo?: { name: string } } };
    assert.strictEqual(initData.result?.serverInfo?.name, "killer-game");

    const sessionId = typeof init.headers["mcp-session-id"] === "string" ? init.headers["mcp-session-id"] : undefined;
    assert.ok(sessionId && sessionId.length > 0, "session id should be returned");

    const tools = await mcpPost(server, { jsonrpc: "2.0", id: 2, method: "tools/list" }, sessionId);
    assert.strictEqual(tools.statusCode, 200);
    const toolsData = parseSseJson(tools.payload) as { result?: { tools: Array<{ name: string } > } };
    const names = toolsData.result?.tools.map((t) => t.name).sort();
    assert.deepStrictEqual(names, [
      "add_player",
      "create_game",
      "delete_game",
      "eliminate_player",
      "finish_game",
      "get_game",
      "list_games",
      "list_players",
      "remove_player",
      "start_game",
      "update_game",
      "update_player",
    ]);
  });

  it("creates a game and returns the private token", async () => {
    const sessionId = await initializeSession(server);
    const response = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "create_game",
          arguments: { name: "MCP Test Game", organizer_email: "test@example.com" },
        },
      },
      sessionId,
    );
    assert.strictEqual(response.statusCode, 200);
    const data = parseSseJson(response.payload) as { result?: { content: Array<{ text: string } > } };
    const game = JSON.parse(data.result?.content[0].text ?? "{}") as { name: string; private_token: string };
    assert.strictEqual(game.name, "MCP Test Game");
    assert.ok(game.private_token, "game should have a private token");
  });

  it("returns sanitized game data without token and full data with token argument", async () => {
    const game = await server.container.gameService.create({ name: "Auth Test Game" });

    const publicResp = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "get_game", arguments: { id_or_slug: game.id } },
      },
      await initializeSession(server),
    );
    assert.strictEqual(publicResp.statusCode, 200);
    const publicData = parseSseJson(publicResp.payload) as { result?: { content: Array<{ text: string } > } };
    const publicGame = JSON.parse(publicData.result?.content[0].text ?? "{}") as Record<string, unknown>;
    assert.strictEqual(publicGame.private_token, undefined);

    const adminResp = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: { name: "get_game", arguments: { id_or_slug: game.id, private_token: game.private_token } },
      },
      await initializeSession(server),
    );
    const adminData = parseSseJson(adminResp.payload) as { result?: { content: Array<{ text: string } > } };
    const adminGame = JSON.parse(adminData.result?.content[0].text ?? "{}") as Record<string, unknown>;
    assert.strictEqual(adminGame.private_token, game.private_token);
  });

  it("adds a player when authorized", async () => {
    const game = await server.container.gameService.create({ name: "Player Test Game" });
    const sessionId = await initializeSession(server);

    const response = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "add_player",
          arguments: { game_id_or_slug: game.id, private_token: game.private_token, name: "Alice", action: "Make them wink" },
        },
      },
      sessionId,
    );
    assert.strictEqual(response.statusCode, 200);
    const data = parseSseJson(response.payload) as { result?: { content: Array<{ text: string } > } };
    const player = JSON.parse(data.result?.content[0].text ?? "{}") as { name: string; game_id: string };
    assert.strictEqual(player.name, "Alice");
    assert.strictEqual(player.game_id, game.id);
  });

  it("rejects start_game with fewer than 2 players", async () => {
    const game = await server.container.gameService.create({ name: "Start Test Game" });
    const sessionId = await initializeSession(server);

    const response = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "start_game", arguments: { id_or_slug: game.id, private_token: game.private_token } },
      },
      sessionId,
    );
    assert.strictEqual(response.statusCode, 200);
    const data = parseSseJson(response.payload) as { result?: { isError?: boolean; content: Array<{ text: string } > } };
    assert.strictEqual(data.result?.isError, true);
    assert.ok(data.result?.content[0].text.includes("not enough players"));
  });

  it("starts a game with at least 2 players", async () => {
    const game = await server.container.gameService.create({ name: "Start Success Game" });
    const sessionId = await initializeSession(server);

    await server.container.playerService.create({ game_id: game.id, name: "Alice", action: "Wink" });
    await server.container.playerService.create({ game_id: game.id, name: "Bob", action: "Sing" });

    const response = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "start_game", arguments: { id_or_slug: game.id, private_token: game.private_token } },
      },
      sessionId,
    );
    assert.strictEqual(response.statusCode, 200);
    const data = parseSseJson(response.payload) as { result?: { content: Array<{ text: string } > } };
    const updated = JSON.parse(data.result?.content[0].text ?? "{}") as { started_at: string };
    assert.ok(updated.started_at);
  });

  it("starts a game and shuffles the chain when requested", async () => {
    const game = await server.container.gameService.create({ name: "Start Shuffle Game" });
    const sessionId = await initializeSession(server);

    server.container.playerService.setRandomForTesting(() => 0.99);
    for (const name of ["A", "B", "C"]) {
      await server.container.playerService.create({ game_id: game.id, name, action: `Action ${name}` });
    }
    // Fisher-Yates with random() = 0 turns [A, B, C] into [B, C, A]
    server.container.playerService.setRandomForTesting(() => 0);

    const response = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "start_game",
          arguments: { id_or_slug: game.id, private_token: game.private_token, shuffle: true },
        },
      },
      sessionId,
    );
    assert.strictEqual(response.statusCode, 200);
    const data = parseSseJson(response.payload) as { result?: { content: Array<{ text: string }> } };
    const updated = JSON.parse(data.result?.content[0].text ?? "{}") as { started_at: string };
    assert.ok(updated.started_at);

    const players: Array<{ name: string }> = await server.container
      .db("players")
      .where({ game_id: game.id })
      .orderBy("order", "asc");
    assert.deepStrictEqual(
      players.map((p) => p.name),
      ["B", "C", "A"],
    );
  });

  it("returns isError for invalid tool input", async () => {
    const sessionId = await initializeSession(server);
    const response = await mcpPost(
      server,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "create_game", arguments: {} },
      },
      sessionId,
    );
    assert.strictEqual(response.statusCode, 200);
    const data = parseSseJson(response.payload) as { result?: { isError?: boolean } };
    assert.strictEqual(data.result?.isError, true);
  });

  describe("admin token resolution", () => {
    it("accepts the token from the Authorization header", async () => {
      const game = await server.container.gameService.create({ name: "Header Game" });
      const headers = { authorization: game.private_token };
      const sessionId = await initializeSession(server, headers);

      const result = await callTool(server, sessionId, "add_player", { game_id_or_slug: game.slug, name: "Ghost" }, headers);
      assert.strictEqual(result.isError, undefined, result.text);
      assert.strictEqual(JSON.parse(result.text).name, "Ghost");
    });

    it("accepts a Bearer-prefixed Authorization header", async () => {
      const game = await server.container.gameService.create({ name: "Bearer Game" });
      const headers = { authorization: `Bearer ${game.private_token}` };
      const sessionId = await initializeSession(server, headers);

      const result = await callTool(server, sessionId, "list_players", { game_id_or_slug: game.id }, headers);
      assert.strictEqual(result.isError, undefined, result.text);
      assert.deepStrictEqual(JSON.parse(result.text).data, []);
    });

    it("prefers the game_admin_token argument over the header", async () => {
      const gameA = await server.container.gameService.create({ name: "Game A" });
      const gameB = await server.container.gameService.create({ name: "Game B" });
      const headers = { authorization: gameA.private_token };
      const sessionId = await initializeSession(server, headers);

      const result = await callTool(
        server,
        sessionId,
        "add_player",
        { game_id_or_slug: gameB.id, game_admin_token: gameB.private_token, name: "Zed" },
        headers,
      );
      assert.strictEqual(result.isError, undefined, result.text);
      assert.strictEqual(JSON.parse(result.text).game_id, gameB.id);
    });

    it("explains how to provide a token when none is given", async () => {
      const game = await server.container.gameService.create({ name: "No Token Game" });
      const sessionId = await initializeSession(server);

      const result = await callTool(server, sessionId, "add_player", { game_id_or_slug: game.id, name: "Ghost" });
      assert.strictEqual(result.isError, true);
      assert.match(result.text, /missing game admin token/);
      assert.match(result.text, /Authorization header/);
    });

    it("tells the caller when a player token is used instead of the game token", async () => {
      const game = await server.container.gameService.create({ name: "Wrong Token Game" });
      const player = await server.container.playerService.create({ game_id: game.id, name: "Alice", action: "Wink" });
      const sessionId = await initializeSession(server);

      const result = await callTool(server, sessionId, "update_player", {
        player_id: player.id,
        game_admin_token: player.private_token,
        name: "Alicia",
      });
      assert.strictEqual(result.isError, true);
      assert.match(result.text, /player token/);
    });

    it("returns an error on get_game when an explicit token is invalid", async () => {
      const game = await server.container.gameService.create({ name: "Bad Read Game" });
      const sessionId = await initializeSession(server);

      const result = await callTool(server, sessionId, "get_game", {
        id_or_slug: game.slug,
        game_admin_token: "00000000-0000-0000-0000-000000000000",
      });
      assert.strictEqual(result.isError, true);
      assert.match(result.text, /invalid game admin token/);
    });

    it("lists the game matching the header token", async () => {
      const game = await server.container.gameService.create({ name: "Listed Game" });
      await server.container.gameService.create({ name: "Other Game" });
      const headers = { authorization: game.private_token };
      const sessionId = await initializeSession(server, headers);

      const result = await callTool(server, sessionId, "list_games", {}, headers);
      const { data } = JSON.parse(result.text) as { data: Array<{ id: string }> };
      assert.deepStrictEqual(data.map((g) => g.id), [game.id]);
    });
  });

  describe("record formatting", () => {
    it("exposes ISO timestamps, an admin URL and a bumped updated_at", async () => {
      const game = await server.container.gameService.create({ name: "Format Game" });
      // Simulate a game created a while ago so the update is observable.
      await server.container.db("games").where({ id: game.id }).update({ updated_at: "2020-01-01 00:00:00" });
      const sessionId = await initializeSession(server);
      const token = { game_admin_token: game.private_token };

      const updated = JSON.parse(
        (await callTool(server, sessionId, "update_game", { id_or_slug: game.id, ...token, name: "Renamed" })).text,
      ) as Record<string, string>;

      const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      assert.match(updated.created_at, iso);
      assert.match(updated.updated_at, iso);
      assert.ok(updated.updated_at > "2020-01-01T00:00:00.000Z", "updated_at should move forward");
      assert.strictEqual(updated.game_admin_token, game.private_token);
      assert.strictEqual(
        updated.admin_url,
        `https://the-killer.online/en/games/${game.slug}?password=${game.private_token}`,
      );
    });

    it("bumps updated_at on players", async () => {
      const game = await server.container.gameService.create({ name: "Player Format Game" });
      const player = await server.container.playerService.create({ game_id: game.id, name: "Alice", action: "Wink" });
      await server.container.db("players").where({ id: player.id }).update({ updated_at: "2020-01-01 00:00:00" });
      const sessionId = await initializeSession(server);

      const result = await callTool(server, sessionId, "update_player", {
        player_id: player.id,
        game_admin_token: game.private_token,
        action: "Sing",
      });
      const updated = JSON.parse(result.text) as Record<string, string>;
      assert.ok(updated.updated_at > "2020-01-01T00:00:00.000Z");
      assert.strictEqual(updated.player_token, player.private_token);
      assert.ok(updated.player_url.endsWith(`/en/games/${game.slug}/players/${player.id}?password=${player.private_token}`));
    });
  });

  describe("playing a game", () => {
    async function setupStartedGame(names: string[]) {
      const game = await server.container.gameService.create({ name: "Play Game" });
      const players = [];
      for (const name of names) {
        players.push(await server.container.playerService.create({ game_id: game.id, name, action: `${name} task` }));
      }
      const sessionId = await initializeSession(server);
      const token = { game_admin_token: game.private_token };
      return { game, players, sessionId, token };
    }

    it("refuses to eliminate a player before the game starts", async () => {
      const { players, sessionId, token } = await setupStartedGame(["Alice", "Bob"]);
      const result = await callTool(server, sessionId, "eliminate_player", { player_id: players[1].id, ...token });
      assert.strictEqual(result.isError, true);
      assert.match(result.text, /not started/);
    });

    it("eliminates players and finishes the game with a winner", async () => {
      const { game, sessionId, token } = await setupStartedGame(["Alice", "Bob", "Carol"]);
      await callTool(server, sessionId, "start_game", { id_or_slug: game.id, ...token });
      // Players join at a random position: read the actual chain order.
      const players = await server.container.db("players").where({ game_id: game.id }).orderBy("order", "asc");

      const first = JSON.parse(
        (await callTool(server, sessionId, "eliminate_player", { player_id: players[1].id, ...token })).text,
      );
      assert.strictEqual(first.player.id, players[1].id);
      assert.ok(first.player.killed_at);
      assert.strictEqual(first.killed_by.id, players[0].id);
      assert.strictEqual(first.game_finished, false);

      const again = await callTool(server, sessionId, "eliminate_player", { player_id: players[1].id, ...token });
      assert.strictEqual(again.isError, true);

      const last = JSON.parse(
        (await callTool(server, sessionId, "eliminate_player", { player_id: players[2].id, ...token })).text,
      );
      assert.strictEqual(last.killed_by.id, players[0].id);
      assert.strictEqual(last.game_finished, true);
      assert.strictEqual(last.winner.id, players[0].id);
      assert.ok(last.game.finished_at);

      const stored = await server.container.gameService.fetchByIdOrSlug(game.id);
      assert.ok(stored.finished_at);
    });

    it("finishes a started game on demand", async () => {
      const { game, sessionId, token } = await setupStartedGame(["Alice", "Bob"]);

      const early = await callTool(server, sessionId, "finish_game", { id_or_slug: game.id, ...token });
      assert.strictEqual(early.isError, true);

      await callTool(server, sessionId, "start_game", { id_or_slug: game.id, ...token });
      const finished = JSON.parse((await callTool(server, sessionId, "finish_game", { id_or_slug: game.id, ...token })).text);
      assert.ok(finished.finished_at);

      const twice = await callTool(server, sessionId, "finish_game", { id_or_slug: game.id, ...token });
      assert.strictEqual(twice.isError, true);
    });
  });
});

async function callTool(
  server: UseServerReturn,
  sessionId: string,
  name: string,
  args: Record<string, unknown>,
  headers: Record<string, string> = {},
): Promise<{ isError?: boolean; text: string }> {
  const response = await mcpPost(
    server,
    { jsonrpc: "2.0", id: 99, method: "tools/call", params: { name, arguments: args } },
    sessionId,
    headers,
  );
  assert.strictEqual(response.statusCode, 200);
  const data = parseSseJson(response.payload) as { result?: { isError?: boolean; content: Array<{ text: string }> } };
  return { isError: data.result?.isError, text: data.result?.content[0].text ?? "" };
}

async function initializeSession(server: UseServerReturn, extraHeaders: Record<string, string> = {}): Promise<string> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
    ...extraHeaders,
  };

  const response = await server.server.inject({
    method: "POST",
    url: "/mcp",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0.0" },
      },
    }),
  });
  assert.strictEqual(response.statusCode, 200);
  const sessionId = response.headers["mcp-session-id"];
  assert.ok(typeof sessionId === "string" && sessionId.length > 0);
  return sessionId;
}
