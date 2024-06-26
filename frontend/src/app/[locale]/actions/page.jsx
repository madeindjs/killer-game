import HeroWithCard from "@/components/atoms/HeroWithCard";
import BetaWarning from "@/components/molecules/BeteWarning";
import GameCreateForm from "@/components/pages/GameCreateForm";
import { STYLES } from "@/constants/styles";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default function Page() {
  const t = useTranslations("actions");
  const tHome = useTranslations("homepage");

  const actions = useDefaultActions();

  return (
    <>
      <h1 className={STYLES.h1}>{t("title")}</h1>

      <p>{t("headline")}</p>

      <ul>
        {actions.map((action, i) => (
          <li key={i}>{action}</li>
        ))}
      </ul>

      <HeroWithCard
        card={
          <>
            <h2 className={STYLES.h2}>{t("HomeHeroCardContent.create")}</h2>
            <GameCreateForm />
          </>
        }
        side={
          <>
            <h2 className={STYLES.h1}>{t("GameCreateCard.title")}</h2>
            <div className="py-6 flex flex-col gap-2">
              <p>{tHome("HowDoesItWork.descriptions.1")}</p>
              <p>{tHome("HowDoesItWork.descriptions.2")}</p>
            </div>
            <BetaWarning />
          </>
        }
      />
    </>
  );
}

/**
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params, searchParams }, parent) {
  const t = await getTranslations("actions");

  return {
    title: t("title"),
    description: t("headline"),
  };
}
