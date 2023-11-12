import FaqForPlayer from "@/components/organisms/FaqForPlayer";
import GameTutorialExample from "@/components/organisms/GameTutorialExample";
import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";

export default function HelpPage() {
  const { t, lang } = useTranslation("help");
  return (
    <RootLayout lang={lang}>
      <h1 className={STYLES.h1}>{t("title")}</h1>
      <p>{t("headline")}</p>

      <GameTutorialExample />
      <FaqForPlayer />
    </RootLayout>
  );
}
