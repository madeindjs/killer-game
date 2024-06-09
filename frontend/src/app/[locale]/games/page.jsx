import GamesCreated from "@/components/pages/GamesCreated";
import GamesJoined from "@/components/pages/GamesJoined";
import { useTranslations } from "next-intl";
import Head from "next/head";

export default function GamesPages() {
  const t = useTranslations("games-created");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <GamesCreated />
      <hr className="divider" />
      <GamesJoined />
    </>
  );
}
