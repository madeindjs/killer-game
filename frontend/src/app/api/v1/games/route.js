import db from "@/lib/drizzle/database.mjs";
import { Games } from "@/lib/drizzle/schema.mjs";
import Ajv from "ajv";
import { count, eq } from "drizzle-orm";
import slugify from "slugify";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

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
      password: { type: "string" },
    },
    required: ["name", "password"],
  };

  const ajv = new Ajv();
  const body = await req.json();
  const valid = ajv.validate(schema, body);

  if (!valid) return new Response(JSON.stringify(ajv.errors), { status: 400 });

  const slug = await findSlug(body.name);

  const [game] = await db.insert(Games).values({ name: body.name, password: body.password, slug }).returning();

  return Response.json({ data: game });
}

async function findSlug(name) {
  const slugName = slugify(name);

  const [{ count: slugNameAlreadyExists }] = await db
    .select({ count: count() })
    .from(Games)
    .where(eq(Games.slug, slugName));

  if (!slugNameAlreadyExists) return slugName;

  const [{ count: gamesCount }] = await db.select({ count: count() }).from(Games);

  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    separator: "-",
    seed: gamesCount,
  });
}
