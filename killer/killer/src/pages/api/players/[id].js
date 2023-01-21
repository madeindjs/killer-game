import { getDb } from "../../../db";

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
async function gameDelete(req, res) {
  const gameId = Number(req.query.id);

  const db = await getDb();

  try {
    await db("games").delete().where({ id: gameId });

    // const [id] = await db("games").insert(game);
    // game.id = id;
    res.statusCode(202);
  } catch (e) {
    res.status(500).json(e);
  }
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
async function gameShow(req, res) {
  const db = await getDb();

  try {
    const [game] = await db("games").select("*").where({ id: req.query.id });
    if (game) {
      res.status(200).json(game);
    } else {
      res.statusCode(404);
    }
  } catch (e) {
    res.status(500).json(e);
  }
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await gameDelete(req, res);
  } else {
    await gameShow(req, res);
  }
}
