import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";

import { getGameNotFoundResponse, getInvalidTokenResponse } from "@/constants/responses";

/**
 * @param {Request} req
 */
export async function GET(req, { params }) {
  const authorization = req.headers.get("authorization");
  if (!authorization) return getInvalidTokenResponse();

  const [game] = await db.select().from(Games).where(eq(Games.id, params.gameId));
  if (!game) return getGameNotFoundResponse();

  if (game.privateToken !== authorization) return getInvalidTokenResponse();

  // TODO: not sure it works
  const displayAllPlayers = Boolean(req.query?.["displayAllPlayers"]);

  const actions = await db.select().from(GameActions).where(eq(GameActions.gameId, params.gameId));
  const players = await db.select().from(Players).where(eq(Players.gameId, params.gameId));

  function findAction(actionId) {
    return actions.find((a) => a.id === actionId);
  }

  const orderList = players.map((p) => p.order);
  const minOrder = Math.min(...orderList);
  const maxOrder = Math.max(...orderList);

  /**
   * @param {(typeof players)[0]} player
   */
  function canDisplayPlayer(player) {
    if (displayAllPlayers) return true;
    return !player.killedAt;
  }

  /**
   * @param {number} order
   *
   */
  function findNextPlayer(order) {
    const nextOrder = order + 1 <= maxOrder ? order + 1 : minOrder;

    const nextPlayer = players.find((p) => p.order === nextOrder && canDisplayPlayer(p));
    if (nextPlayer) return nextPlayer;

    return findNextPlayer(nextOrder);
  }

  /** @type {import("@killer-game/types").GamePlayersTable} */
  const table = players.filter(canDisplayPlayer).map((player) => {
    const target = findNextPlayer(player.order);
    const action = findAction(target.actionId);
    return { player, target, action };
  });

  return Response.json({ data: table });
}
