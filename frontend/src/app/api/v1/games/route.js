import db from "@/lib/drizzle/database.mjs";
import { Games } from "@/lib/drizzle/schema.mjs";

/**
 * @param {Request} request
 */
export async function GET(request) {
  const rows = await db.select().from(Games);

  return Response.json({ data: 1, rows });
}

/**
 * @param {Request} request
 */
export async function POST(request) {
  const [game] = await db
    .insert(Games)
    .values({
      name: "test",
    })
    .returning();

  return Response.json({ data: game });
}
