import { getDb } from "../../../db";

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
async function playerCreate(req, res) {
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
async function playerList(req, res) {
  const db = await getDb();

  console.log(req.query);

  try {
    const players = await db("players").select("*");
    res.status(200).json(players);
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
    await playerCreate(req, res);
  } else {
    await playerList(req, res);
  }
}
