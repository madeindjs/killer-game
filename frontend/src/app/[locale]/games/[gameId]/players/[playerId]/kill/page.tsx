import HeroWithCard from "@/components/atoms/HeroWithCard";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import { STYLES } from "@/constants/styles";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { PlayerRecord } from "@killer-game/types";
import KillButton from "./components/KillButton";

export const dynamic = "force-dynamic";

export default async function PlayerKillPage(props: {
  params: Promise<{ playerId: string; locale: string }>;
  searchParams: Promise<{ password?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const playerId = params.playerId;
  const killToken = searchParams.password ?? "";

  const t = await getTranslations("player-kill");

  const player = (await client.fetchPlayer(
    playerId,
    undefined
  )) as PlayerRecord;

  return (
    <HeroWithCard
      card={
        <>
          <div className="flex gap-4 mb-3 items-center">
            <PlayerAvatar player={player} />
            <div className="flex flex-col gap-3">
              <p className={STYLES.h2}>{player.name}</p>
            </div>
          </div>
          <KillButton killToken={killToken} playerId={player.id} />
        </>
      }
      side={
        <>
          <h1 className={STYLES.h1}>
            {t("PlayerKillPage.youAreKilling")}
            <strong className="text-primary">{player?.name ?? playerId}</strong>
          </h1>
          <p>{t("PlayerKillPage.headline")}</p>
        </>
      }
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const tGame = await getTranslations("player-kill");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
    robots: { index: false, follow: false },
  };
}