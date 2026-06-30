import ApplicationStats from "@/components/organisms/ApplicationStats";
import HeroWithCard from "@/components/atoms/HeroWithCard";
import BetaWarning from "@/components/molecules/BetaWarning";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import GameCreateForm from "@/components/pages/GameCreateForm";
import GameTutorialExample from "@/components/organisms/GameTutorialExample";
import { STYLES } from "@/constants/styles";
import { PlayerRecord } from "@killer-game/types";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

function HomeHeroCardContent() {
  const t = useTranslations("homepage.HomeHeroCardContent");
  const lang = useLocale();

  return (
    <div>
      <h2 className={STYLES.h2}>{t("create")}</h2>
      <GameCreateForm />
      <div className="divider text-sm opacity-60 before:h-px after:h-px">
        {t("or")}
      </div>
      <Link
        href={`/${lang}/games`}
        className="btn btn-outline btn-secondary w-full"
      >
        {t("join")}
      </Link>
    </div>
  );
}

function Feedbacks() {
  const t = useTranslations("homepage.Feedbacks");

  const feedbacks = [
    { content: t("feedback1.content"), name: t("feedback1.name") },
    { content: t("feedback2.content"), name: t("feedback2.name") },
    { content: t("feedback3.content"), name: t("feedback3.name") },
  ];

  return (
    <section className={STYLES.section}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className={STYLES.h2}>{t("title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body text-center">
                <div className="flex justify-center mb-4">
                  <PlayerAvatar
                    player={{ name: feedback.name } as PlayerRecord}
                  />
                </div>
                <p className="text-lg italic opacity-90 mb-4">
                  “{feedback.content}”
                </p>
                <p className="font-bold text-primary">{feedback.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const t = useTranslations("homepage.Pricing");

  return (
    <section className={STYLES.section}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className={STYLES.h2}>{t("title")}</h2>
          <p className={STYLES.paragraph}>{t("description1")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-3xl">{t("free")}</h3>
              <p className="opacity-90">{t("description2")}</p>
              <ul className="flex flex-col gap-2 my-4">
                <li>✔️ {t("features.createGames")}</li>
                <li>✔️ {t("features.invitePlayers")}</li>
                <li>✔️ {t("features.realTime")}</li>
                <li>✔️ {t("features.fun")}</li>
              </ul>
              <Link
                href="mailto:alexandre@rsseau.fr"
                className="btn btn-primary"
              >
                ✉️ {t("sayThankYou")}
              </Link>
            </div>
          </div>
          <div className="card bg-linear-to-br from-secondary to-accent text-secondary-content shadow-xl">
            <div className="card-body text-black">
              <h3 className="card-title text-3xl">{t("sponsor")}</h3>
              <p>{t("payAsYouWant")}</p>
              <ul className="flex flex-col gap-2 my-4">
                <li>✔️ {t("features.sameAsFree")}</li>
                <li>✔️ {t("features.iWillWork")}</li>
              </ul>
              <Link
                href="https://www.paypal.com/donate/?hosted_button_id=XAFRHK5VY276U"
                className="btn btn-ghost text-secondary-content"
              >
                💰 {t("supportMeLinks.paypal")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  const t = useTranslations("homepage.Roadmap");

  const ideas = [t("ideas.slack"), t("ideas.customizeGame"), t("ideas.places")];

  return (
    <section className={STYLES.section}>
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className={STYLES.h2}>🚀 {t("title")}</h2>
        <p className={STYLES.paragraph + " mb-8"}>{t("description")}</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {ideas.map((idea, index) => (
            <span
              key={index}
              className="badge badge-outline badge-lg p-4 text-base"
            >
              {idea}
            </span>
          ))}
        </div>
        <Link href="mailto:alexandre@rsseau.fr" className="btn btn-secondary">
          ✉️ {t("contactMe")}
        </Link>
      </div>
    </section>
  );
}

export default function Page() {
  const t = useTranslations("common");
  const tHome = useTranslations("homepage");

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative">
          <HeroWithCard
            className="py-20 md:py-28"
            side={
              <div className="flex flex-col gap-4">
                <h1 className={STYLES.h1}>{t("appNameLong")}</h1>
                <p className="text-xl md:text-2xl opacity-95">
                  {tHome("headline")}
                </p>
                <BetaWarning />
              </div>
            }
            card={<HomeHeroCardContent />}
          />
        </div>
      </section>

      <section className={STYLES.section + " bg-base-200/50"}>
        <div className="container mx-auto px-4 max-w-6xl">
          <ApplicationStats />
        </div>
      </section>

      <section className={STYLES.section + " bg-base-200/50"}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={STYLES.h2}>{tHome("HowDoesItWork.title")}</h2>
          </div>
          <GameTutorialExample />
        </div>
      </section>

      <Feedbacks />

      <Pricing />

      <Roadmap />
    </>
  );
}

export async function generateMetadata() {
  const t = await getTranslations("common");
  const tHome = await getTranslations("homepage");

  return {
    title: t("appName"),
    description: tHome("headline"),
  };
}
