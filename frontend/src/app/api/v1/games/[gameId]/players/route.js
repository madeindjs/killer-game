import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";

import { getGameNotFoundResponse } from "@/constants/responses";
import { getNextPlayerOrder } from "@/lib/drizzle/queries.mjs";
import { getGameNextAction } from "@/utils/game.server";
import { sanitizePlayer } from "@/utils/player.server";
import Ajv from "ajv";
/** @import { NextRequest } from "next/server" */

/**
 * @param {Request} req
 */
export async function GET(req, { params }) {
  const [game] = await db.select({ id: Games.privateToken }).from(Games).where(eq(Games.id, params.gameId));
  if (!game) return getGameNotFoundResponse();

  const isAdmin = game.privateToken === String(req.headers.get("authorization"));

  const players = await db.select().from(Players).where(eq(Players.gameId, params.gameId));

  if (!isAdmin) return Response.json({ data: players.map(sanitizePlayer) });

  const actions = await db.select().from(GameActions).where(eq(GameActions.gameId, params.gameId));

  return Response.json({ data: players, includes: actions });
}

/**
 * @param {NextRequest} req
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
  const body = await req.json();
  const valid = ajv.validate(schema, body);

  if (!valid) return new Response(JSON.stringify(ajv.errors), { status: 400 });

  const [game] = await db.select({ startedAt: Games.startedAt }).from(Games).where(eq(Games.id, params.gameId));

  if (!game) return getGameNotFoundResponse();
  if (game.startedAt) return Response.json({ error: "Cannot add player because game started" }, { status: 400 });

  const actionId = body?.["action_id"] ? body?.["action_id"] : await getGameNextAction(params.gameId);

  const [player] = await db
    .insert(Players)
    .values({
      name: body?.["name"],
      gameId: params.gameId,
      actionId: actionId,
      avatar: body?.["avatar"],
      order: await getNextPlayerOrder(params.gameId),
    })
    .returning();

  return Response.json({ data: player });
}
