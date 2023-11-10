import GameJoin from "@/components/pages/GameJoin";
import RootLayout from "@/components/templates/layout";

export const metadata = {
  title: "Join the game",
  // description: "Manage your game",
};

export default function GameJoinPage() {
  const gameId = router.query.id;

  return (
    <RootLayout>
      <main>
        <GameJoin gameId={gameId} />
      </main>
    </RootLayout>
  );
}
