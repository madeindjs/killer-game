import HeroWithCard from "@/components/atoms/HeroWithCard";
import BetaWarning from "@/components/molecules/BetaWarning";
import GameCreateForm from "@/components/pages/GameCreateForm";
import { STYLES } from "@/constants/styles";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ActionsView />;
}

function ActionsView() {
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
            <h2 className={STYLES.h2}>{tHome("HomeHeroCardContent.create")}</h2>
            <GameCreateForm />
          </>
        }
        side={
          <>
            <h2 className={STYLES.h2}>{t("GameCreateCard.title")}</h2>
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("actions");

  return {
    title: t("title"),
    description: t("headline"),
  };
}
