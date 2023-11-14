import GamesCreated from "@/components/pages/GamesCreated";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

export default function GamesPages() {
  const { lang, t } = useTranslation("game-dashboard");

  return (
    <RootLayout lang={lang}>
      <Head>
        <title>{t("title")}</title>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <GamesCreated />
    </RootLayout>
  );
}
