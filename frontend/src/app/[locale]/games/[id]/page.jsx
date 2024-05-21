import HeroWithCard from "@/components/atoms/HeroWithCard";
import AlertWarningUrlToken from "@/components/molecules/AlertWarningUrlToken";
import CardSectionCollapse from "@/components/molecules/CardSectionCollapse";
import { TimeSinceStartedCountDown } from "@/components/molecules/TimeSinceStartedCountDown";
import GameEditButton from "@/components/organisms/GameEditButton";
import GameEvents from "@/components/organisms/GameEvents";
import GameJoinLink from "@/components/organisms/GameJoinLink";
import GamePodium from "@/components/organisms/GamePodium";
import GameStartButton from "@/components/organisms/GameStartButton";
import PlayersAvatars from "@/components/organisms/PlayersAvatars";
import Unauthorized from "@/components/organisms/Unauthorized";
import GameDashboardInviteButton from "@/components/pages/GameDashboardInviteButton";
import GameDashboardPlayers from "@/components/pages/GameDashboardPlayers";
import GameDashboardTimeline from "@/components/server/GameDashboardTimeline";
import PlayerCreateForm from "@/components/server/PlayerCreateForm";
import { STYLES } from "@/constants/styles";
import db from "@/lib/drizzle/database.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params, searchParams }) {
  const gameId = params.id;
  const password = searchParams.password;

  const t = await getTranslations("games");
  const tCommon = await getTranslations("common");

  const [game] = await db.select().from(Games).where(eq(Games.id, gameId)).limit(1);

  if (game === undefined) return notFound();
  if (game.privateToken !== password) return <Unauthorized />;

  const players = await db.select().from(Players).where(eq(Players.gameId, gameId));

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

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex">
          <h1 className={STYLES.h1 + " flex-grow"}>{game.name}</h1>
          {game.started_at && (
            <div className="flex items-center">
              <TimeSinceStartedCountDown
                startedAt={game.started_at}
                stop={game.finished_at}
                className={game.finished_at ? "text-success" : ""}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="overflow-x-auto">{players && <PlayersAvatars className="flex-grow" players={players} />}</div>

          {false && <GameDashboardInviteButton game={game} players={players} disabled={!!game.started_at} />}
          {false && <GameEditButton game={game} disabled={!!game.started_at} />}
          {false && <GameStartButton game={game} disabled={players?.length < 2 || game.finished_at} />}
        </div>
      </div>
      <div className="grid xs:grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 w-full">
          <CardSectionCollapse
            className="w-full"
            title={tCommon("count.player", { count: players.length })}
            open={!game.started_at && players?.length > 0}
          >
            <Suspense fallback={<p>Loading players avatars</p>}>
              <GameDashboardPlayers players={players} game={game} />
            </Suspense>
          </CardSectionCollapse>
          {!!game.started_at && (
            <CardSectionCollapse title={tCommon("dashboard.podium")} open>
              <GamePodium podium={dashboard.podium} />
            </CardSectionCollapse>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CardSectionCollapse title={tCommon("dashboard.timeline")} open>
            <GameDashboardTimeline players={players} game={game} />
          </CardSectionCollapse>
          {!!game.started_at && (
            <CardSectionCollapse title={tCommon("dashboard.events")} open>
              <GameEvents events={dashboard.events} />
            </CardSectionCollapse>
          )}
        </div>
      </div>
    </>
  );
}
