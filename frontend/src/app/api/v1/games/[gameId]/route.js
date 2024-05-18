import { getGameNotFoundResponse } from "@/constants/responses";
import db from "@/lib/drizzle/database.mjs";
import { Games } from "@/lib/drizzle/schema.mjs";
import { sanitizeGame } from "@/utils/game.server";
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
