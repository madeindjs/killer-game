import { getDb } from "../../../db";

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
async function gameCreate(req, res) {
  /** @type {Game} */
  const game = req.body;
  const db = await getDb();

  try {
    const [id] = await db("games").insert(game);
    game.id = id;
    res.status(201).json(game);
  } catch (e) {
    res.status(500).json(e);
  }
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
async function gameList(req, res) {
  const db = await getDb();

  try {
    const games = await db("games").select("*");
    res.status(200).json(games);
  } catch (e) {
    res.status(500).json(e);
  }
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    await gameCreate(req, res);
  } else {
    await gameList(req, res);
  }
}
