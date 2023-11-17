import GameDashboard from "@/components/pages/GameDashboard";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";

export default function GameDashboardPage() {
  const { t, lang } = useTranslation("common");
  const { t: tGame } = useTranslation("game-dashboard");
  const router = useRouter();

  const gameId = router.query.id;
  const password = router.query.password;

  return (
    <RootLayout lang={lang}>
      <Head>
        <title>{tGame("title")}</title>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <main>
        <GameDashboard gameId={gameId} gamePrivateToken={password} />
      </main>
    </RootLayout>
  );
}
