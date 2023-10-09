import GameDashboard from "@/containers/GameDashboard";

/** @type {import('next').Metadata} */
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
