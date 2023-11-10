import GameDashboard from "@/components/pages/GameDashboard";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

export default function GameDashboardPage() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const gameId = router.query.id;
  const password = router.query.password;

  return (
    <RootLayout lang={lang}>
      <main>
        {password && <p className="text-warning">{t("dontShareUrl")}</p>}
        <GameDashboard gameId={gameId} gamePrivateToken={password} />
      </main>
    </RootLayout>
  );
}
