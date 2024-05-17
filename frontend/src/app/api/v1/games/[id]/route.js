import db from "@/lib/drizzle/database.mjs";
import { Games } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";

/**
 * @param {Request} request
 */
export async function GET(request, { params }) {
  const [game] = await db.select().from(Games).where(eq(Games.id, params.id)).limit(1);

  if (game === undefined) {
    return new Response(null, { status: 404 });
  }

  return Response.json({ data: game });
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
