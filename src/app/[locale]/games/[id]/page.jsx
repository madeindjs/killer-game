import Unauthorized from "@/components/organisms/Unauthorized";
import { STYLES } from "@/constants/styles";
import db from "@/lib/drizzle/database.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import GameEditor from "./components/GameEditor.server";
import PlayerCreateButton from "./components/PlayerCreateButton";
import StartGameButton from "./components/StartGameButton";

export default async function Page({ params, searchParams }) {
  const slug = params.id;
  const password = searchParams.password;

  const [game] = await db.select().from(Games).where(eq(Games.slug, slug)).limit(1);

  if (game === undefined) return notFound();

  console.log("re-render");

  const isAdmin = game.password === password;
  const isGameStarted = game.startedAt !== undefined;
  const players = await db.select().from(Players).where(eq(Players.gameId, game.id));

  if (isAdmin) {
    return (
      <>
        <h1 className={STYLES.h1 + " mb-6"}>{game.name}</h1>
        <GameEditor game={game} players={players} />
        <PlayerCreateButton game={game} />
        <StartGameButton game={game} />
      </>
    );
  }

  return <Unauthorized />;
}
