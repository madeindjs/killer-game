import GameDashboard from "@/components/pages/GameDashboard";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  const gameId = params.gameId;
  const password = searchParams.password;

  const game = await client.fetchGame(gameId, password);
  if (!game) return notFound();
  if (!game.private_token) return redirect(`/`);

  const players = await client.fetchPlayers(game.id, game.private_token);

  return (
    <main>
      <GameDashboard game={game} players={players} />
    </main>
  );
}

/**
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
