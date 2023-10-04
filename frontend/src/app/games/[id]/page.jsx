import GameDashboard from "@/components/GameDashboard";

export default function Home({ params: { id: gameId }, searchParams: { token: gamePrivateToken } }) {
  return (
    <main>
      <h1>Game</h1>
      <GameDashboard gameId={gameId} gamePrivateToken={gamePrivateToken}></GameDashboard>
    </main>
  );
}
