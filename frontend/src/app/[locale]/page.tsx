import HeroWithCard from "@/components/atoms/HeroWithCard";
import BetaWarning from "@/components/molecules/BeteWarning";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import { GameExampleAnimated } from "@/components/organisms/GameExampleAnimated";
import GameCreateForm from "@/components/pages/GameCreateForm";
import { STYLES } from "@/constants/styles";
import { PlayerRecord } from "@killer-game/types";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

function HomeHeroCardContent() {
  const t = useTranslations("homepage.HomeHeroCardContent");

  return (
    <div>
      <h2 className={STYLES.h2}>{t("create")}</h2>
      <GameCreateForm />
    </div>
  );
}

function Pricing() {
  const t = useTranslations("homepage.Pricing");

  return (
    <div className="hero min-h-screen">
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 ">
        <div className="text-center lg:text-left flex flex-col gap-4 fle">
          <h2 className={STYLES.h1}>{t("title")}</h2>
          <p>{t("description1")}</p>
          <p>{t("description2")}</p>
        </div>
        <div className="flex flex-wrap gap-4 align-middle justify-center">
          <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <div className="card-body">
              <h3 className="card-title">{t("free")}</h3>
              <ul className="flex flex-col gap-2 mb-3">
                <li>✔️ {t("features.createGames")}</li>
                <li>✔️ {t("features.invitePlayers")}</li>
                <li>✔️ {t("features.realTime")}</li>
                <li>✔️ {t("features.fun")}</li>
                <li>✔️ {t("features.contactSupport")}</li>
              </ul>
              <Link
                href="mailto:alexandre@rsseau.fr"
                className="btn btn-secondary"
              >
                ✉️ {t("sayThankYou")}
              </Link>
            </div>
          </div>
          <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <div className="card-body">
              <h3 className="card-title">{t("sponsor")}</h3>
              <ul className="flex flex-col gap-2 mb-3">
                <li>✔️ {t("features.sameAsFree")}</li>
                <li>✔️ {t("features.iWillWork")}</li>
              </ul>
              <p className="mb-2">{t("payAsYouWant")}</p>
              <Link
                href="https://www.paypal.com/donate/?hosted_button_id=XAFRHK5VY276U"
                className="btn btn-secondary"
              >
                💰 {t("supportMeLinks.paypal")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Roadmap() {
  const t = useTranslations("homepage.Roadmap");

  return (
    <HeroWithCard
      card={
        <ul className="flex flex-col gap-2 mb-3">
          <li>⬜ {t("ideas.slack")}</li>
          <li>⬜ {t("ideas.customizeGame")}</li>
          <li>⬜ {t("ideas.places")}</li>
          <li>⬜ {t("ideas.pictures")}</li>
        </ul>
      }
      side={
        <>
          <h2 className={STYLES.h1}>🚀{t("title")}</h2>
          <p className="mb-4">{t("description")}</p>
          <Link href="mailto:alexandre@rsseau.fr" className="btn btn-secondary">
            ✉️ {t("contactMe")}
          </Link>
        </>
      }
    />
  );
}

function HowDoesItWork() {
  const t = useTranslations("homepage.HowDoesItWork");
  const lang = useLocale();

  function Section({ icon, title, description }) {
    return (
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h3 className={STYLES.h3}>
            <span className="mr-2">{icon}</span>
            {title}
          </h3>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen">
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 ">
        <div className="text-center lg:text-left flex flex-col gap-4 fle">
          <h2 className={STYLES.h1}>{t("title")}</h2>
          <p>{t("descriptions.0")}</p>
          <p>{t("descriptions.1")}</p>
          <p>{t("descriptions.2")}</p>
          <Link href={`/${lang}/help`} className="btn btn-secondary">
            {t("seeHelp")}
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 align-middle justify-center">
          <Section
            icon="📝"
            title={t("step1.title")}
            description={t("step1.description")}
          />
          <Section
            icon="🪄"
            title={t("step2.title")}
            description={t("step2.description")}
          />
          <Section
            icon="🏁"
            title={t("step3.title")}
            description={t("step3.description")}
          />
          <Section
            icon="🚬"
            title={t("step4.title")}
            description={t("step4.description")}
          />
        </div>
      </div>
    </div>
  );
}

function Feedbacks() {
  const t = useTranslations("homepage.Feedbacks");
  function Section({ content, name }) {
    return (
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="flex gap-4">
            <div>{<PlayerAvatar player={{ name } as PlayerRecord} />}</div>
            <div>
              <p className="mb-2">{content}</p>
              <p className="text-right text-neutral-content">{name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left">
          <h2 className={STYLES.h1}>{t("title")}</h2>
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
          <Section
            content={t("feedback1.content")}
            name={t("feedback1.name")}
          />
          <Section
            content={t("feedback2.content")}
            name={t("feedback2.name")}
          />
          <Section
            content={t("feedback3.content")}
            name={t("feedback3.name")}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const t = useTranslations("common");
  const tHome = useTranslations("homepage");

  return (
    <>
      <GameExampleAnimated />
      <HeroWithCard
        side={
          <>
            <h1 className={STYLES.h1}>{t("appNameLong")}</h1>
            <p className="py-6">{tHome("headline")}</p>
            <BetaWarning />
          </>
        }
        card={<HomeHeroCardContent />}
      />
      <HowDoesItWork />
      <Pricing />
      <Feedbacks />
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
