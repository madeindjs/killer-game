import PlayerDashboard from "@/components/pages/PlayerDashboard";
import RootLayout from "@/components/templates/layout";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Player dashboard",
  // description: "Manage your game",
};

export default function PlayerDashboardPage() {
  const { t } = useTranslation("common");

  const playerId = router.query.id;
  const password = router.query.password;

  return (
    <RootLayout>
      <main>
        {playerPrivateToken && <p className="text-warning">{t("dontShareUrl")}</p>}
        <PlayerDashboard
          playerId={playerId}
          playerPrivateToken={password}
          i18nGameUrlNotValid={t("gameUrlNotValid")}
          i18nGameHasStopped={t("gameHasStopped")}
          i18nGameHasStarted={t("gameHasStarted")}
        />
      </main>
    </RootLayout>
  );
}
