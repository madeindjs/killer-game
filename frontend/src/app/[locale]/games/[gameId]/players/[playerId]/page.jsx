import PlayerDashboard from "@/components/pages/PlayerDashboard";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params, searchParams }) {
  const playerId = params.playerId;
  const password = searchParams.password;

  const player = await client.fetchPlayer(playerId, password);

  if (!player) return notFound();
  if (!player.private_token) return redirect(`/`);

  const game = await client.fetchGame(player.game_id);

  const players = await client.fetchPlayers(game.id);

  return <PlayerDashboard player={player} game={game} players={players} />;
}

/**
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params, searchParams }, parent) {
  const tGame = await getTranslations("player-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
  };
}
