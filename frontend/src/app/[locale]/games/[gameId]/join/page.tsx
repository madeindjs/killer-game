import GameJoin from "@/components/pages/GameJoin";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { GameRecord, PlayerRecordSanitized } from "@killer-game/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tGame = await getTranslations("game-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
    robots: { index: false, follow: false },
  };
}

export default async function Page(props: {
  params: Promise<{ gameId: string; locale: string }>;
}) {
  const params = await props.params;
  const game = (await client.fetchGame(params.gameId)) as GameRecord;

  if (!game) return notFound();

  const players = (await client.fetchPlayers(
    game.id
  )) as unknown as PlayerRecordSanitized[];

  return <GameJoin game={game} players={players} />;
}