import GameJoin from "@/components/pages/GameJoin";
import RootLayout from "@/components/templates/layout";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const gameId = router.query.id;
  const t = useTranslations("game-dashboard");

  return (
    <RootLayout>
      <Head>
        <title>{t("title")}</title>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <GameJoin gameId={gameId} />
    </RootLayout>
  );
}
