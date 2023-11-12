import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import GameJoinForm from "@/components/organisms/GameJoinForm";
import GameCreateForm from "@/components/pages/GameCreateForm";
import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Link from "next/link";

function HomeHero() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>{t("appNameLong")}</h1>
          <p className="py-6">{t("home.headline")}</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <HomeHeroCardContent />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeHeroCardContent() {
  const { t } = useTranslation("homepage");

  return (
    <div>
      <h2 className={STYLES.h2}>{t("HomeHeroCardContent.create")}</h2>
      <GameCreateForm />
      <div className="divider">{t("HomeHeroCardContent.or")}</div>
      <h2 className={STYLES.h2}>{t("HomeHeroCardContent.join")}</h2>
      <GameJoinForm />
    </div>
  );
}

function Pricing() {
  const { t, lang } = useTranslation("homepage");

  return (
    <div className="hero min-h-screen">
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 ">
        <div className="text-center lg:text-left flex flex-col gap-4 fle">
          <h2 className={STYLES.h1}>{t("Pricing.title")}</h2>
          <p>{t("Pricing.description1")}</p>
          <p>{t("Pricing.description2")}</p>
        </div>
        <div className="flex flex-wrap gap-4 align-middle justify-center">
          <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <div className="card-body">
              <h3 className="card-title">{t("Pricing.supportMeLinks.title")}</h3>
              <Link href="https://www.paypal.com/donate/?hosted_button_id=XAFRHK5VY276U" className="btn btn-secondary">
                💰 {t("Pricing.supportMeLinks.paypal")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowDoesItWork() {
  const { t, lang } = useTranslation("homepage");

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
          <h2 className={STYLES.h1}>{t("HowDoesItWork.title")}</h2>
          <p>{t("HowDoesItWork.descriptions.0")}</p>
          <p>{t("HowDoesItWork.descriptions.1")}</p>
          <p>{t("HowDoesItWork.descriptions.2")}</p>
          <Link href={`/${lang}/help`} className="btn btn-secondary">
            {t("HowDoesItWork.seeHelp")}
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 align-middle justify-center">
          <Section
            icon="📝"
            title={t("HowDoesItWork.step1.title")}
            description={t("HowDoesItWork.step1.description")}
          />
          <Section
            icon="🪄"
            title={t("HowDoesItWork.step2.title")}
            description={t("HowDoesItWork.step2.description")}
          />
          <Section
            icon="🏁"
            title={t("HowDoesItWork.step3.title")}
            description={t("HowDoesItWork.step3.description")}
          />
          <Section
            icon="🚬"
            title={t("HowDoesItWork.step4.title")}
            description={t("HowDoesItWork.step4.description")}
          />
        </div>
      </div>
    </div>
  );
}

function Feedbacks() {
  const { t } = useTranslation("homepage");
  function Section({ content, name }) {
    return (
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="flex gap-4">
            <div>{<PlayerAvatar player={{ name }} />}</div>
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
          <h2 className={STYLES.h1}>{t("Feedbacks.title")}</h2>
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
          <Section content={t("Feedbacks.feedback1.content")} name={t("Feedbacks.feedback1.name")} />
          <Section content={t("Feedbacks.feedback2.content")} name={t("Feedbacks.feedback2.name")} />
          <Section content={t("Feedbacks.feedback3.content")} name={t("Feedbacks.feedback3.name")} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useTranslation("common");
  const { t: tHome } = useTranslation("homepage");

  return (
    <RootLayout lang={lang}>
      <Head>
        <title>{t("appName")}</title>
        <meta name="description" content={tHome("headline")}></meta>
      </Head>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className={STYLES.h1}>{t("appNameLong")}</h1>
            <p className="py-6">{tHome("headline")}</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
            <div className="card-body">
              <HomeHeroCardContent />
            </div>
          </div>
        </div>
      </div>
      <HowDoesItWork />
      <Pricing />
      <Feedbacks />
    </RootLayout>
  );
}
