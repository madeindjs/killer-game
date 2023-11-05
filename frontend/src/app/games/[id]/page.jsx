import AlertWarningUrlToken from "@/components/molecules/AlertWarningUrlToken";
import GameDashboard from "@/components/pages/GameDashboard";

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
