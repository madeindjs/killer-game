import FaqForPlayer from "@/components/organisms/FaqForPlayer";
import GameTutorialExample from "@/components/organisms/GameTutorialExample";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HelpView />;
}

function HelpView() {
  const t = useTranslations("help");

  return (
    <>
      <h1 className={STYLES.h1}>{t("title")}</h1>
      <p className="mb-16">{t("headline")}</p>
      <div className="mb-16">
        <GameTutorialExample />
      </div>

      <FaqForPlayer />
    </>
  );
}

/**
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  const t = await getTranslations("help");

  return {
    title: t("title"),
    description: t("headline"),
  };
}
