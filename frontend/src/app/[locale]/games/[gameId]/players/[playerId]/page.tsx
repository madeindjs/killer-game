import PlayerDashboard from "@/components/pages/PlayerDashboard";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { GameRecord, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ playerId: string; gameId: string; locale: string }>;
  searchParams: Promise<{ password?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const playerId = params.playerId;
  const password = searchParams.password;

  const player = (await client.fetchPlayer(playerId, password)) as PlayerRecord;

  if (!player) return notFound();
  if (!player.private_token) return redirect(`/`);

  const game = (await client.fetchGame(player.game_id)) as GameRecord;

  const players = (await client.fetchPlayers(
    game.id
  )) as unknown as PlayerRecordSanitized[];

  return (
    <PlayerDashboard
      key={`${game.id}-${player.id}`}
      player={player}
      game={game}
      players={players}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const tGame = await getTranslations("player-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
    robots: { index: false, follow: false },
  };
}