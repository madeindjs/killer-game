import { getGameNotFoundResponse, getInvalidTokenResponse, getPlayerNotFoundResponse } from "@/constants/responses";
import db from "@/lib/drizzle/database.mjs";
import { updatePlayer } from "@/lib/drizzle/queries.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import Ajv from "ajv";
import { and, asc, eq } from "drizzle-orm";

/**
 * @param {Request} req
 */
export async function DELETE(req, { params }) {
  const { gameId, playerId } = params;
  const [game] = await db.select({ password: Games.password }).from(Games).where(eq(Games.id, gameId));

  if (!game) return getGameNotFoundResponse();
  const isAdmin = game.password === String(req.headers.get("authorization"));
  if (!isAdmin) return getInvalidTokenResponse();

  const [player] = await db
    .select({ id: Players.id })
    .from(Players)
    .where(and(eq(Players.gameId, gameId), eq(Players.id, playerId)));

  if (!player) return getPlayerNotFoundResponse();

  await db.delete(Players).where(and(eq(Players.gameId, gameId), eq(Players.id, playerId)));

  const players = await db.select().from(Players).where(eq(Players.gameId, gameId)).orderBy(asc(Players.order));

  return Response.json({ data: players });
}

/**
 * @param {Request} req
 */
export async function PUT(req, { params }) {
  const [game] = await db.select({ password: Games.password }).from(Games).where(eq(Games.id, params.gameId));
  if (!game) return getGameNotFoundResponse();

  const isAdmin = game.password === String(req.headers.get("authorization"));
  if (!isAdmin) return getInvalidTokenResponse();

  const [player] = await db
    .select()
    .from(Players)
    .where(and(eq(Players.gameId, params.gameId), eq(Players.id, params.playerId)));

  if (!player) return getPlayerNotFoundResponse();

  // TODO: validate
  const body = await req.json();

  const ajv = new Ajv();

  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      avatar: { type: "object" },
      order: { type: "number" },
      action: { type: "string" },
    },
  };

  const isValid = ajv.validate(schema, body);
  if (!isValid) return Response.json({ error: ajv.errors }, { status: 400 });

  const playerUpdated = await updatePlayer({
    ...player,
    name: body.name ?? player.name,
    avatar: body.avatar ?? player.avatar,
    action: body.action ?? player.action,
    order: body.order ?? player.order,
  });

  return Response.json({ data: playerUpdated });
}
