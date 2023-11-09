import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import { LANGS, TRANSLATIONS } from "@/lib/i18n";
import GameJoinForm from "../../components/organisms/GameJoinForm";
import GameCreateForm from "../../components/pages/GameCreateForm";
import GamesCreated from "../../components/pages/GamesCreated";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "The Killer game",
  // description: "Manage your game",
};

function HomeHeroCardContent() {
  return (
    <div>
      <h2 className={STYLES.h2}>Create a game</h2>
      <GameCreateForm key={0} />
      <div className="divider">OR</div>
      <h2 className={STYLES.h2}>Join a game</h2>
      <GameJoinForm />
    </div>
  );
}

/**
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 */
function HomeHero({ lang }) {
  const t = TRANSLATIONS[lang];
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>{t.APP_NAME_LONG}</h1>
          <p className="py-6">{t.HOME_HEADLINE}</p>
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

/**
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 */
function HowDoesItWork({ lang }) {
  const translations = {
    en: {
      STEP_1: {
        title: "You create your game",
        description:
          "We ask you the participants and the actions they will have to do (don't panic, we propose you many).",
      },
      STEP_2: {
        title: "The game is generated",
        description: "The application generates cards so that all the opponents can meet without being blocked.",
      },
      STEP_3: {
        title: "You start the game",
        description:
          "All the participants receive their mission by mail. They access to a dashboard page with the game's state.",
      },
      STEP_4: {
        title: "And that's it",
        description: "You have access to a real time dashboard of the game, you know who is winning and who is losing.",
      },
    },
    fr: {
      STEP_1: {
        title: "You create your game",
        description:
          "We ask you the participants and the actions they will have to do (don't panic, we propose you many).",
      },
      STEP_2: {
        title: "The game is generated",
        description: "The application generates cards so that all the opponents can meet without being blocked.",
      },
      STEP_3: {
        title: "You start the game",
        description:
          "All the participants receive their mission by mail. They access to a dashboard page with the game's state.",
      },
      STEP_4: {
        title: "And that's it",
        description: "You have access to a real time dashboard of the game, you know who is winning and who is losing.",
      },
    },
  };

  const t = TRANSLATIONS[lang];
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>{t.APP_NAME_LONG}</h1>
          <p className="py-6">{t.HOME_HEADLINE}</p>
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

/**
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 */
export default function HomePage({ lang }) {
  return (
    <RootLayout lang={lang}>
      <HomeHero lang={lang} />
      <GamesCreated lang={lang} />
      <HowDoesItWork lang={lang} />
    </RootLayout>
  );
}

/**
 * @type {import("next").GetStaticPaths}
 */
export async function getStaticPaths() {
  return {
    paths: LANGS.map((lang) => ({
      params: { lang },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Pass post data to the page via props
  return { props: { lang: params.lang } };
}
