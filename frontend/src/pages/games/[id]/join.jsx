import GameJoin from "@/components/pages/GameJoin";
import RootLayout from "@/components/templates/layout";
import Head from "next/head";

export const metadata = {
  title: "Join the game",
  // description: "Manage your game",
};

export default function GameJoinPage() {
  const gameId = router.query.id;

  return (
    <RootLayout>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
      </Head>
      <GameJoin gameId={gameId} />
    </RootLayout>
  );
}