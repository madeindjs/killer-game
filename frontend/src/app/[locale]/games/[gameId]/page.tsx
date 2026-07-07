import GameDashboard from "@/components/pages/GameDashboard";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ gameId: string; locale: string }>;
  searchParams: Promise<{ password?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const gameId = params.gameId;
  const password = searchParams.password;

  const game = (await client.fetchGame(gameId, password)) as GameRecord;
  if (!game) return notFound();
  if (!game.private_token) return redirect(`/`);

  const players = (await client.fetchPlayers(
    game.id,
    game.private_token
  )) as PlayerRecord[];

  return (
    <main>
      <GameDashboard game={game} players={players} />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const tGame = await getTranslations("game-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
    robots: { index: false, follow: false },
  };
}