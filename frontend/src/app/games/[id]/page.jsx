import GameDashboard from "@/components/GameDashboard";

export default function GameDashboardPage({ params: { id: gameId }, searchParams: { token: gamePrivateToken } }) {
  return (
    <main>
      <GameDashboard gameId={gameId} gamePrivateToken={gamePrivateToken}></GameDashboard>
    </main>
  );
}
