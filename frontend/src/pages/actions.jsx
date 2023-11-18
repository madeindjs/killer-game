import HeroWithCard from "@/components/atoms/HeroWithCard";
import BetaWarning from "@/components/molecules/BeteWarning";
import GameCreateForm from "@/components/pages/GameCreateForm";
import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import { useDefaultActions } from "@/hooks/use-default-actions";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

export default function ActionsPage() {
  const { t, lang } = useTranslation("actions");
  const { t: tHome } = useTranslation("homepage");

  const actions = useDefaultActions();

  return (
    <RootLayout lang={lang}>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={tHome("headline")}></meta>
      </Head>

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
    </RootLayout>
  );
}
