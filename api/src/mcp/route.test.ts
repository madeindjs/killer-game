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
): Promise<{ statusCode: number; payload: string; headers: Record<string, string | string[] | undefined> }> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
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
      "get_game",
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
});

async function initializeSession(server: UseServerReturn): Promise<string> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
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
