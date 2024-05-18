import { getGameNotFoundResponse, getInvalidTokenResponse, getPlayerNotFoundResponse } from "@/constants/responses";
import db from "@/lib/drizzle/database.mjs";
import { updatePlayer } from "@/lib/drizzle/queries/update-player.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import { and, eq } from "drizzle-orm";

/**
 * @param {Request} req
 */
export async function DELETE(req, { params }) {
  const [game] = await db.select({ privateToken: Games.privateToken }).from(Games).where(eq(Games.id, params.gameId));

  if (!game) return getGameNotFoundResponse();

  const [player] = await db
    .select({ privateToken: Players.privateToken })
    .from(Players)
    .where(and(eq(Players.gameId, game.id), eq(Players.id, params.playerId)));

  if (!player) return getPlayerNotFoundResponse();

  if (![player.privateToken, game.privateToken].includes(req.headers.get("authorization"))) {
    return getInvalidTokenResponse();
  }

  await db.delete(Players).where(and(eq(Players.gameId, game.id), eq(Players.id, params.playerId)));

  return new Response(null, { status: 202 });
}

/**
 * @param {Request} req
 */
export async function UPDATE(req, { params }) {
  const [game] = await db.select({ privateToken: Games.privateToken }).from(Games).where(eq(Games.id, params.gameId));

  if (!game) return getGameNotFoundResponse();

  const [player] = await db
    .select({ privateToken: Players.privateToken })
    .from(Players)
    .where(and(eq(Players.gameId, game.id), eq(Players.id, params.playerId)));

  if (!player) return getPlayerNotFoundResponse();

  if (![player.privateToken, game.privateToken].includes(req.headers.get("authorization"))) {
    return getInvalidTokenResponse();
  }

  // TODO: validate
  const body = await req.json();

  const playerUpdated = await updatePlayer({
    ...player,
    name: body?.["name"],
    avatar: body?.["avatar"],
    action_id: body?.["action_id"] ?? player.action_id,
    order: body?.["order"] ?? player.order,
  });

  return Response.json({ data: playerUpdated });
}
