import GameForm from "@/components/GameForm";
import GamesCreated from "@/components/GamesCreated";
import Tabs from "@/components/Tabs";
import { STYLES } from "@/constants/styles";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "The Killer game",
  // description: "Manage your game",
};

function HomeHeroCardContent() {
  return <Tabs tabs={["Create a game", "Join a game"]} contents={[<GameForm key={0} />]}></Tabs>;
  return;
}

function HomeHero() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>Killer game</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In
            deleniti eaque aut repudiandae et a id nisi.
          </p>
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

export default function Home() {
  return (
    <main>
      <HomeHero />

      <GamesCreated />
    </main>
  );
}
