import db from "@/lib/drizzle/database.mjs";
import { Games } from "@/lib/drizzle/schema.mjs";
import { sanitizeGame } from "@/utils/game.server";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

/**
 * @param {NextRequest} req
 */
export async function GET(req, { params }) {
  const [game] = await db.select().from(Games).where(eq(Games.id, params.id)).limit(1);

  if (game === undefined) return new Response(null, { status: 404 });

  const isAdmin = game.privateToken === String(req.headers.get("authorization"));

  if (!isAdmin) return Response.json({ data: sanitizeGame(game) });

  return Response.json({ data: game });
}
