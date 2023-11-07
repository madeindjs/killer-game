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
 *
 * @param {{lang: import("@/lib/i18n").Lang}} param0
 * @returns
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

export default function Home({ lang }) {
  return (
    <RootLayout>
      <HomeHero lang={lang} />
      <GamesCreated lang={lang} />
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
