import FaqForPlayer from "@/components/organisms/FaqForPlayer";
import GameTutorialExample from "@/components/organisms/GameTutorialExample";
import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

export default function HelpPage() {
  const { t, lang } = useTranslation("help");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <h1 className={STYLES.h1}>{t("title")}</h1>
      <p className="mb-16">{t("headline")}</p>
      <div className="mb-16">
        <GameTutorialExample />
      </div>

      <FaqForPlayer />
    </>
  );
}
