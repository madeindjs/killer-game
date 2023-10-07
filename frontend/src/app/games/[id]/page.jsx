import GameDashboard from "@/containers/GameDashboard";

export const metadata = {
  title: "Game dashboard",
  // description: "Manage your game",
};

export default function GameDashboardPage({ params: { id: gameId }, searchParams: { token: gamePrivateToken } }) {
  return (
    <main>
      <GameDashboard gameId={gameId} gamePrivateToken={gamePrivateToken}></GameDashboard>
    </main>
  );
}
