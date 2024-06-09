import PlayerDashboard from "@/components/pages/PlayerDashboard";
import { getTranslations } from "next-intl/server";

export default function Page({ params, searchParams }) {
  const playerId = params.playerId;
  const password = searchParams.password;

  return <PlayerDashboard playerId={playerId} playerPrivateToken={password} />;
}

/**
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params, searchParams }, parent) {
  const tGame = await getTranslations("player-dashboard");

  return {
    title: tGame("title"),
    referrer: "no-referrer",
  };
}
