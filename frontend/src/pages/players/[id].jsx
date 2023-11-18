import PlayerDashboard from "@/components/pages/PlayerDashboard";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";

export default function PlayerDashboardPage() {
  const { t } = useTranslation("player-dashboard");
  const router = useRouter();

  const playerId = router.query.id;
  const password = router.query.password;

  return (
    <RootLayout>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
        <title>{t("title")}</title>
      </Head>
      <PlayerDashboard playerId={playerId} playerPrivateToken={password} />
    </RootLayout>
  );
}
