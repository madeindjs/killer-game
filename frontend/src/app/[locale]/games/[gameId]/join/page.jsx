import GameJoin from "@/components/pages/GameJoin";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 *
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params, searchParams }, parent) {
  const tGame = await getTranslations("game-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
  };
}

export default async function Page({ params, searchParams }) {
  const game = await client.fetchGame(params.gameId);

  if (!game) return notFound();

  return <GameJoin game={game} />;
}
