import GamesCreated from "@/components/pages/GamesCreated";
import GamesJoined from "@/components/pages/GamesJoined";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

export default function GamesPages() {
  const { lang, t } = useTranslation("games-created");

  return (
    <RootLayout lang={lang}>
      <Head>
        <title>{t("title")}</title>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <GamesCreated />
      <hr className="divider" />
      <GamesJoined />
    </RootLayout>
  );
}
