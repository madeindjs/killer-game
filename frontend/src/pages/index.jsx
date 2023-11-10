import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import GameJoinForm from "@/components/organisms/GameJoinForm";
import GameCreateForm from "@/components/pages/GameCreateForm";
import GamesCreated from "@/components/pages/GamesCreated";
import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

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

function HowDoesItWork() {
  const { t } = useTranslation("homepage");

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
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left flex flex-col gap-4">
          <h2 className={STYLES.h1}>{t("HowDoesItWork.title")}</h2>
          <p className="text-2xl">{t("HowDoesItWork.descriptions.0")}</p>
          <p className="text-2xl">{t("HowDoesItWork.descriptions.1")}</p>
          <p className="text-2xl">{t("HowDoesItWork.descriptions.2")}</p>
        </div>
        <div className="flex flex-wrap gap-4">
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
          <h2 className={STYLES.h2}>{t("Feedbacks.title")}</h2>
        </div>
        <Section content={t("Feedbacks.feedback1.content")} name={t("Feedbacks.feedback1.name")} />
        <Section content={t("Feedbacks.feedback2.content")} name={t("Feedbacks.feedback2.name")} />
        <Section content={t("Feedbacks.feedback3.content")} name={t("Feedbacks.feedback3.name")} />
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
      <GamesCreated title={tHome("GamesCreated.title")} />
      <HowDoesItWork />
      <Feedbacks />
    </RootLayout>
  );
}
