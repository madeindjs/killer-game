import AlertWarningUrlToken from "@/components/molecules/AlertWarningUrlToken";
import PlayerDashboard from "@/components/pages/PlayerDashboard";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Player dashboard",
  // description: "Manage your game",
};

export default function PlayerDashboardPage({
  params: { id: playerId },
  searchParams: { password: playerPrivateToken },
}) {
  return (
    <main>
      {playerPrivateToken && <AlertWarningUrlToken></AlertWarningUrlToken>}
      <PlayerDashboard playerId={playerId} playerPrivateToken={playerPrivateToken} />
    </main>
  );
}
