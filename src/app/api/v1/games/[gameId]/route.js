import { getGameNotFoundResponse } from "@/constants/responses";
import db from "@/lib/drizzle/database.mjs";
import { Games } from "@/lib/drizzle/schema.mjs";
import { sanitizeGame } from "@/utils/game.server";
import Ajv from "ajv";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

/**
 * @param {NextRequest} req
 */
export async function GET(req, { params }) {
  const [game] = await db.select().from(Games).where(eq(Games.id, params.gameId)).limit(1);

  if (game === undefined) return getGameNotFoundResponse();

  const isAdmin = game.privateToken === req.headers.get("authorization");

  if (!isAdmin) return Response.json({ data: sanitizeGame(game) });

  return Response.json({ data: game });
}

/**
 * @param {Request} req
 */
export async function PUT(req, { params }) {
  const [game] = await db
    .select({ password: Games.password, name: Games.name, startedAt: Games.startedAt })
    .from(Games)
    .where(eq(Games.id, params.gameId));
  if (!game) return getGameNotFoundResponse();

  const isAdmin = game.password === String(req.headers.get("authorization"));
  if (!isAdmin) return getInvalidTokenResponse();

  const body = await req.json();

  const ajv = new Ajv();

  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      startedAt: { type: "string" },
    },
  };

  const isValid = ajv.validate(schema, body);
  if (!isValid) return Response.json({ error: ajv.errors }, { status: 400 });

  const [gameUpdated] = await db
    .update(Games)
    .set({
      name: body.name ?? game.name,
      startedAt: body.startedAt ? new Date(body.startedAt) : game.startedAt,
    })
    .where(eq(Games.id, params.gameId))
    .returning();

  return Response.json({ data: gameUpdated });
}
