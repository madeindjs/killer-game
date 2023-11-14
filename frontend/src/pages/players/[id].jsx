import PlayerDashboard from "@/components/pages/PlayerDashboard";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Player dashboard",
  // description: "Manage your game",
};

export default function PlayerDashboardPage() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const playerId = router.query.id;
  const password = router.query.password;

  return (
    <RootLayout>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      {password && <p className="text-warning">{t("dontShareUrl")}</p>}
      <PlayerDashboard playerId={playerId} playerPrivateToken={password} />
    </RootLayout>
  );
}
