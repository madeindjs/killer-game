import HeroWithCard from "@/components/atoms/HeroWithCard";
import AlertWarningUrlToken from "@/components/molecules/AlertWarningUrlToken";
import GameJoinLink from "@/components/organisms/GameJoinLink";
import Unauthorized from "@/components/organisms/Unauthorized";
import PlayerCreateForm from "@/components/server/PlayerCreateForm";
import { STYLES } from "@/constants/styles";
import db from "@/lib/drizzle/database.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";
import { useTranslations as useTranslation } from "next-intl";
import { notFound } from "next/navigation";

export default async function Page({ params, searchParams }) {
  const gameId = params.id;
  const password = searchParams.password;

  const t = useTranslation("games");

  const [game] = await db.select().from(Games).where(eq(Games.id, gameId)).limit(1);

  if (game === undefined) return notFound();
  if (game.privateToken !== password) return <Unauthorized />;

  const players = await db.select().from(Players).where(eq(Players.gameId, gameId));

  function handlePlayerCreate() {}

  if (players.length === 0) {
    return (
      <HeroWithCard
        side={
          <>
            <h2 className={STYLES.h2}>
              ✨ {t("GameDashboardContent.noPlayers.welcome")}&nbsp;
              <strong className="text-primary">{game.name}</strong>
            </h2>
            <p className="mb-4">{t("GameDashboardContent.noPlayers.headline")}</p>
            <AlertWarningUrlToken />
            <div className="divider"></div>
            <h3 className={STYLES.h3}>{t("GameDashboardContent.noPlayers.addPlayer")}</h3>

            <p>{t("GameDashboardInvite.linkDescription")}</p>
            <GameJoinLink game={game} />
          </>
        }
        card={
          <>
            <PlayerCreateForm defaultName="Alexandre" onSubmit={handlePlayerCreate} gameId={gameId} />
          </>
        }
      />
    );
  }

  return <p>TODO</p>;
}
