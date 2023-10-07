import AlertWarningUrlToken from "@/components/AlertWarningUrlToken";
import PlayerDashboard from "@/containers/PlayerDashboard";

export const metadata = {
  title: "Player dashboard",
  // description: "Manage your game",
};

export default function PlayerDashboardPage({ params: { id: playerId }, searchParams: { token: playerPrivateToken } }) {
  return (
    <main>
      {playerPrivateToken && <AlertWarningUrlToken></AlertWarningUrlToken>}
      <PlayerDashboard playerId={playerId} playerPrivateToken={playerPrivateToken} />
    </main>
  );
}
