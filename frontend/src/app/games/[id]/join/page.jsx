import GameJoin from "@/components/pages/GameJoin";

export const metadata = {
  title: "Join the game",
  // description: "Manage your game",
};

export default function GameJoinPage({ params: { id: gameId } }) {
  return (
    <main>
      <GameJoin gameId={gameId} />
    </main>
  );
}
