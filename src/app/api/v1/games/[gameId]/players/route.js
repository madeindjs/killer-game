import db from "@/lib/drizzle/database.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import { asc, eq } from "drizzle-orm";

import { getGameNotFoundResponse, getInvalidTokenResponse } from "@/constants/responses";
import { getNextPlayerOrder } from "@/lib/drizzle/queries.mjs";
import { sanitizePlayer } from "@/utils/player.server";
import Ajv from "ajv";
/** @import { NextRequest } from "next/server" */

/**
 * @param {Request} req
 */
export async function GET(req, { params }) {
  const [game] = await db.select({ password: Games.password }).from(Games).where(eq(Games.id, params.gameId));
  if (!game) return getGameNotFoundResponse();

  const isAdmin = game.password === String(req.headers.get("authorization"));

  const players = await db.select().from(Players).where(eq(Players.gameId, params.gameId)).orderBy(asc(Players.order));

  if (!isAdmin) return Response.json({ data: players.map(sanitizePlayer) });

  return Response.json({ data: players });
}

/**
 * @param {NextRequest} req
 */
export async function POST(req, { params }) {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      action: { type: "string" },
    },
    required: ["name"],
  };

  const ajv = new Ajv();
  const body = await req.json();
  const valid = ajv.validate(schema, body);

  if (!valid) return new Response(JSON.stringify(ajv.errors), { status: 400 });

  const [game] = await db
    .select({ startedAt: Games.startedAt, password: Games.password })
    .from(Games)
    .where(eq(Games.id, params.gameId));

  if (!game) return getGameNotFoundResponse();

  const isAdmin = game.password === String(req.headers.get("authorization"));
  if (!isAdmin) return getInvalidTokenResponse();

  if (game.startedAt) return Response.json({ error: "Cannot add player because game started" }, { status: 400 });

  const [player] = await db
    .insert(Players)
    .values({
      name: body?.name,
      gameId: params.gameId,
      action: body?.action ?? "TODO: create action from translations",
      order: await getNextPlayerOrder(params.gameId),
    })
    .returning();

  return Response.json({ data: player });
}
