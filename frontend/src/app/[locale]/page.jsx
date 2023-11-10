import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import GameJoinForm from "@/components/organisms/GameJoinForm";
import GameCreateForm from "@/components/pages/GameCreateForm";
import GamesCreated from "@/components/pages/GamesCreated";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import Head from "next/head";

function HomeHeroCardContent() {
  const t = useTranslations("HomeHeroCardContent");

  return (
    <div>
      <h2 className={STYLES.h2}>{t("create")}</h2>
      <GameCreateForm />
      <div className="divider">{t("or")}</div>
      <h2 className={STYLES.h2}>{t("join")}</h2>
      <GameJoinForm />
    </div>
  );
}

function HomeHero() {
  const t = useTranslations();
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

function HowDoesItWork() {
  const t = useTranslations("HowDoesItWork");

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
          <h2 className={STYLES.h1}>{t("title")}</h2>
          <p className="text-2xl">{t("descriptions.0")}</p>
          <p className="text-2xl">{t("descriptions.1")}</p>
          <p className="text-2xl">{t("descriptions.2")}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Section icon="📝" title={t("step1.title")} description={t("step1.description")} />
          <Section icon="🪄" title={t("step2.title")} description={t("step2.description")} />
          <Section icon="🏁" title={t("step3.title")} description={t("step3.description")} />
          <Section icon="🚬" title={t("step4.title")} description={t("step4.description")} />
        </div>
      </div>
    </div>
  );
}

function Feedbacks() {
  const t = useTranslations("Feedbacks");
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
          <h2 className={STYLES.h2}>{t("title")}</h2>
        </div>
        <Section content={t("feedback1.content")} name={t("feedback1.name")} />
        <Section content={t("feedback2.content")} name={t("feedback2.name")} />
        <Section content={t("feedback3.content")} name={t("feedback3.name")} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations();
  return (
    <>
      <Head>
        <title>{t("appName")}</title>
        <meta name="description" content={t("home.headline")}></meta>
      </Head>
      <HomeHero />
      <GamesCreated
        title={t("GamesCreated.title")}
        i18nSeeGame={t("Game.see")}
        i18nPending={t("Game.status.pending")}
        i18nProgress={t("Game.status.progress")}
      />
      <HowDoesItWork />
      <Feedbacks />
    </>
  );
}
