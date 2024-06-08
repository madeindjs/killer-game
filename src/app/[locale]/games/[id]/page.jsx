import Unauthorized from "@/components/organisms/Unauthorized";
import { STYLES } from "@/constants/styles";
import db from "@/lib/drizzle/database.mjs";
import { Games, Players } from "@/lib/drizzle/schema.mjs";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import GameEditor from "./components/GameEditor";
import StartGameButton from "./components/StartGameButton";

export default async function Page({ params, searchParams }) {
  const slug = params.id;
  const password = searchParams.password;

  const [game] = await db.select().from(Games).where(eq(Games.slug, slug)).limit(1);

  if (game === undefined) return notFound();

  if (game.password === password) {
    const players = await db.select().from(Players).where(eq(Players.gameId, game.id));
    return (
      <>
        <h1 className={STYLES.h1 + " mb-6"}>{game.name}</h1>
        <GameEditor gameId={game.id} players={players} password={password} />
        <StartGameButton game={game} />
      </>
    );
  }

  return <Unauthorized />;
}
