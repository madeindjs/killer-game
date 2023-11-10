import PlayerDashboard from "@/components/pages/PlayerDashboard";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Player dashboard",
  // description: "Manage your game",
};

export default function PlayerDashboardPage({
  params: { id: playerId },
  searchParams: { password: playerPrivateToken },
}) {
  const { t } = useTranslation("common");

  return (
    <main>
      {playerPrivateToken && <p className="text-warning">{t("dontShareUrl")}</p>}
      <PlayerDashboard
        playerId={playerId}
        playerPrivateToken={playerPrivateToken}
        i18nGameUrlNotValid={t("gameUrlNotValid")}
        i18nGameHasStopped={t("gameHasStopped")}
        i18nGameHasStarted={t("gameHasStarted")}
      />
    </main>
  );
}
