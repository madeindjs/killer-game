import GameDashboard from "@/components/pages/GameDashboard";
import { getTranslations } from "next-intl/server";

export default function Page({ params, searchParams }) {
  const gameId = params.gameId;
  const password = searchParams.password;

  return (
    <main>
      <GameDashboard gameId={gameId} gamePrivateToken={password} />
    </main>
  );
}

/**
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params, searchParams }, parent) {
  const tGame = await getTranslations("game-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
  };
}
