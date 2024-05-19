import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games } from "@/lib/drizzle/schema.mjs";
import Ajv from "ajv";
/** @import { NextRequest } from "next/server" */

/**
 * @param {NextRequest} request
 */
export async function GET(request) {
  const rows = await db.select().from(Games);

  return Response.json({ data: 1, rows });
}

/**
 * @param {NextRequest} req
 */
export async function POST(req) {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      actions: { type: "array" },
    },
    required: ["name"],
  };

  const ajv = new Ajv();
  const body = await req.json();
  const valid = ajv.validate(schema, body);

  if (!valid) return new Response(JSON.stringify(ajv.errors), { status: 400 });

  const [game] = await db.insert(Games).values({ name: body.name }).returning();

  if (body?.["actions"] && Array.isArray(body?.["actions"]) && body?.["actions"].length > 0) {
    const actions = body["actions"].map((action) => ({ name: action, gameId: game.id }));
    await db.insert(GameActions).values(actions);
  }

  return Response.json({ data: game });
}
