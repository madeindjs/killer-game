import HeroWithCard from "@/components/atoms/HeroWithCard";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import { STYLES } from "@/constants/styles";
import { client } from "@/lib/client";
import { getTranslations } from "next-intl/server";
import KillButton from "./components/KillButton";

export default async function PlayerKillPage({ params, searchParams }) {
  const playerId = params.playerId;
  const password = searchParams.password;

  const t = await getTranslations("player-kill");

  const player = await client.fetchPlayer(playerId);

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
          <KillButton killToken={killToken} player={player} />
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
