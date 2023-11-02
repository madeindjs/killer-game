import AlertWarningUrlToken from "@/components/AlertWarningUrlToken";
import GameDashboard from "@/containers/GameDashboard";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Game dashboard",
  // description: "Manage your game",
};

export default function GameDashboardPage({ params: { id: gameId }, searchParams: { password: gamePrivateToken } }) {
  return (
    <main>
      {gamePrivateToken && <AlertWarningUrlToken />}
      <GameDashboard gameId={gameId} gamePrivateToken={gamePrivateToken}></GameDashboard>
    </main>
  );
}
