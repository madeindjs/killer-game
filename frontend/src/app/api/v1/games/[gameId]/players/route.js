import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";

import { GameNotFoundResponse } from "@/constants/responses";
import { getGameNextAction } from "@/utils/game.server";
import { sanitizePlayer } from "@/utils/player.server";
import Ajv from "ajv";

/**
 * @param {Request} req
 */
export async function GET(req, { params }) {
  const [game] = await db.select({ id: Games.privateToken }).from(Games).where(eq(Games.id, params.gameId));
  if (!game) return GameNotFoundResponse;

  const isAdmin = game.privateToken === String(req.headers.get("authorization"));

  const players = await db.select().from(Players).where(eq(Players.gameId, params.gameId));

  if (!isAdmin) return Response.json({ data: players.map(sanitizePlayer) });

  const actions = await db.select().from(GameActions).where(eq(GameActions.gameId, params.gameId));

  return Response.json({ data: players, includes: actions });
}

/**
 * @param {Request} req
 */
export async function POST(req, { params }) {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      action_id: { type: "string" },
      avatar: { type: "object" },
    },
    required: ["name"],
  };

  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);

  if (!valid) return new Response(JSON.stringify(ajv.errors));

  const [game] = await db.select().from(Games).where(eq(Games.id, params.gameId));

  if (!game) return GameNotFoundResponse;
  if (game.startedAt) return Response.json({ error: "Cannot add player because game started" }, { status: 400 });

  const actionId = req.body?.["action_id"] ? req.body?.["action_id"] : await getGameNextAction(game.id);

  const [player] = await db
    .insert(Players)
    .values({
      name: req.body?.["name"],
      gameId: game.id,
      actionId: actionId,
      avatar: req.body?.["avatar"],
    })
    .returning();

  return Response.json({ data: player });
}
