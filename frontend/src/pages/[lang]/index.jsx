import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import { LANGS, TRANSLATIONS } from "@/lib/i18n";
import Head from "next/head";
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
      TITLE: "How does it work ?",
      DESCRIPTIONS: [
        "I created this application to manage a game of Killer with more than 60 players.",
        "Managing the game is not an easy task! Knowing the state of the game in real time, distributing cards to everyone, managing absentees and above all, making it fun.",
        "This application allows you to do all that!",
      ],
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
      TITLE: "Comment ça marche ?",
      DESCRIPTIONS: [
        "J'ai créé cette application pour gérer une partie de Killer à plus de 60.",
        "Gérer la partie n'est pas une mince affaire! Connaître l'état de la partie en temps réel, distribuer les cartes à tout le monde, gérer les absents et surtout, rendre ça fun.",
        "Cette application te permet de faire tout cela.",
      ],
      STEP_1: {
        title: "Tu crées ta partie",
        description:
          "On te demande les participants et les actions qu'ils devront faire (pas de panique, on t'en propose plein).",
      },
      STEP_2: {
        title: "On génère la partie",
        description:
          "L'application génère des cartes pour faire en sorte que tous les adversaires puissent se rencontrer sans être bloqués.",
      },
      STEP_3: {
        title: "Tu lances la partie",
        description:
          "Tous les participants reçoivent leur mission par mail. Ils ont accès à un tableau de bord avec l'état de la partie.",
      },
      STEP_4: {
        title: "Et voilà",
        description:
          "Tu as accès à un tableau de bord de la partie en temps réel, tu sais qui est en train de gagner et qui a perdu.",
      },
    },
  };

  const t = translations[lang];

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
          <h2 className={STYLES.h1}>{t.TITLE}</h2>
          {t.DESCRIPTIONS.map((sentence, i) => (
            <p key={i} className="text-2xl">
              {sentence}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <Section icon="📝" title={t.STEP_1.title} description={t.STEP_1.description} />
          <Section icon="🪄" title={t.STEP_2.title} description={t.STEP_2.description} />
          <Section icon="🏁" title={t.STEP_3.title} description={t.STEP_3.description} />
          <Section icon="🚬" title={t.STEP_3.title} description={t.STEP_4.description} />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 */
function Feedbacks({ lang }) {
  const translations = {
    en: {
      TITLE: "Testimonials",
      FEEDBACK_1: {
        name: "Alexandre",
        content:
          "I had my 30th birthday and wanted a game to let everyone talk to each other. Thanks to the killer there was a great atmosphere!",
      },
      FEEDBACK_2: {
        name: "Lorene",
        content:
          "For my wedding I wanted an original activity but not too complicated to organize. My guests loved it and still talk about it :)",
      },
      FEEDBACK_3: {
        name: "Elisa",
        content:
          "In charge of organizing my company seminar I came across this site by chance. The game was a real success, I think I will use it again for my personal events.",
      },
    },
    fr: {
      TITLE: "Ce qu'ils pensent de nous",
      FEEDBACK_1: {
        name: "Alexandre",
        content:
          "J'ai fêté mes 30 ans et je voulais un jeu pour permettre à tout le monde de se parler. Grâce au killer il y a eu une super ambiance !",
      },
      FEEDBACK_2: {
        name: "Lorene",
        content:
          "Pour mon mariage je voulais une activité originale mais pas trop compliquée à organiser. Mes invités ont adoré et m'en parlent encore :)",
      },
      FEEDBACK_3: {
        name: "Elisa",
        content:
          "En charge d'organiser mon séminaire d'entreprise je suis tombée par hasard sur ce site. Le jeu a été un vrai succès, je pense le réutiliser pour mes événements perso.",
      },
    },
  };

  const t = translations[lang];

  function Section({ content, name }) {
    return (
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="flex gap-4">
            <div>
              <PlayerAvatar player={{ name }} />
            </div>
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
          <h2 className={STYLES.h2}>{t.TITLE}</h2>
        </div>
        <Section content={t.FEEDBACK_1.content} name={t.FEEDBACK_1.name} />
        <Section content={t.FEEDBACK_2.content} name={t.FEEDBACK_2.name} />
        <Section content={t.FEEDBACK_3.content} name={t.FEEDBACK_3.name} />
      </div>
    </div>
  );
}

/**
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 */
export default function HomePage({ lang }) {
  const t = TRANSLATIONS[lang];
  return (
    <RootLayout lang={lang}>
      <Head>
        <title>{t.APP_NAME}</title>
        <meta name="description" content={t.HOME_HEADLINE}></meta>
      </Head>
      <HomeHero lang={lang} />
      <GamesCreated lang={lang} />
      <HowDoesItWork lang={lang} />
      <Feedbacks lang={lang} />
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
