import { getGameNotFoundResponse, getInvalidTokenResponse, getPlayerNotFoundResponse } from "@/constants/responses";
import db from "@/lib/drizzle/database.mjs";
import { updatePlayer } from "@/lib/drizzle/queries.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import Ajv from "ajv";
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
export async function PUT(req, { params }) {
  const [game] = await db.select({ privateToken: Games.privateToken }).from(Games).where(eq(Games.id, params.gameId));

  if (!game) return getGameNotFoundResponse();

  const [player] = await db
    .select()
    .from(Players)
    .where(and(eq(Players.gameId, params.gameId), eq(Players.id, params.playerId)));

  if (!player) return getPlayerNotFoundResponse();

  if (![player.privateToken, game.privateToken].includes(req.headers.get("authorization"))) {
    return getInvalidTokenResponse();
  }

  // TODO: validate
  const body = await req.json();

  const ajv = new Ajv();

  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      avatar: { type: "object" },
      order: { type: "number" },
      actionId: { type: "string" },
    },
  };

  const isValid = ajv.validate(schema, body);
  if (!isValid) return Response.json({ error: ajv.errors }, { status: 400 });

  const playerUpdated = await updatePlayer({
    ...player,
    name: body.name ?? player.name,
    avatar: body.avatar ?? player.avatar,
    actionId: body.actionId ?? player.actionId,
    order: body.order ?? player.order,
  });

  return Response.json({ data: playerUpdated });
}
