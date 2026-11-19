import type { APIRequestContext } from "@playwright/test";
import { uniqueGameName } from "../fixtures/api.ts";
import { API_URL } from "../fixtures/env.ts";
import { expect, test } from "../fixtures/test.ts";

test.describe("Public API", () => {
  test("exposes application statistics", async ({ request }) => {
    const res = await request.get(`${API_URL}/stats`);
    expect(res.ok()).toBe(true);
    const { data } = await res.json();
    expect(data.version).toEqual(expect.any(String));
    for (const key of ["games_created", "games_started", "games_finished", "players_eliminated"]) {
      expect(data.counts[key], key).toEqual(expect.any(Number));
    }
  });

  test("serves the interactive documentation", async ({ page }) => {
    const res = await page.goto(`${API_URL}/docs`);
    expect(res?.ok()).toBe(true);
    await expect(page.getByText("Killer Game API").first()).toBeVisible();
  });
});

/** Minimal Streamable HTTP MCP client (JSON-RPC over POST, SSE-framed responses). */
class McpClient {
  #request: APIRequestContext;
  #sessionId?: string;
  #id = 0;

  constructor(request: APIRequestContext) {
    this.#request = request;
  }

  async call(method: string, params: object = {}): Promise<any> {
    const isNotification = method.startsWith("notifications/");
    const headers: Record<string, string> = {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    };
    if (this.#sessionId) headers["mcp-session-id"] = this.#sessionId;

    const res = await this.#request.post(`${API_URL}/mcp`, {
      headers,
      data: { jsonrpc: "2.0", method, params, ...(isNotification ? {} : { id: ++this.#id }) },
    });
    expect(res.status(), `${method}: ${await res.text()}`).toBeLessThan(300);
    this.#sessionId ??= res.headers()["mcp-session-id"];
    if (isNotification) return undefined;

    const body = await res.text();
    const json = JSON.parse(/^data: (.+)$/m.exec(body)?.[1] ?? body);
    if (json.error) throw new Error(`${method}: ${JSON.stringify(json.error)}`);
    return json.result;
  }

  async tool(name: string, args: object): Promise<any> {
    const result = await this.call("tools/call", { name, arguments: args });
    expect(result.isError, JSON.stringify(result)).toBeFalsy();
    return JSON.parse(result.content[0].text);
  }
}

test.describe("MCP server (/mcp)", () => {
  test("lets an AI assistant create a game and manage its players", async ({ request, games }) => {
    const mcp = new McpClient(request);

    const init = await mcp.call("initialize", {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "killer-e2e", version: "1.0.0" },
    });
    expect(init.serverInfo.name).toBe("killer-game");
    await mcp.call("notifications/initialized");

    const { tools } = await mcp.call("tools/list");
    expect(tools.map((t: { name: string }) => t.name)).toEqual(
      expect.arrayContaining([
        "create_game",
        "get_game",
        "update_game",
        "start_game",
        "delete_game",
        "list_players",
        "add_player",
        "update_player",
        "remove_player",
      ]),
    );

    const game = await mcp.tool("create_game", { name: uniqueGameName("mcp") });
    games.track(game);
    expect(game.private_token).toEqual(expect.any(String));

    await mcp.tool("add_player", { game_id_or_slug: game.id, private_token: game.private_token, name: "Alice", action: "wink" });
    await mcp.tool("add_player", { game_id_or_slug: game.id, private_token: game.private_token, name: "Bob", action: "clap" });

    const { data: players } = await mcp.tool("list_players", { game_id_or_slug: game.id, private_token: game.private_token });
    expect(players.map((p: { name: string }) => p.name).sort()).toEqual(["Alice", "Bob"]);

    await mcp.tool("delete_game", { id_or_slug: game.id, private_token: game.private_token });
    const res = await request.get(`${API_URL}/games/${game.id}`);
    expect(res.status()).toBe(404);
  });
});
