import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { createGame } from "../../clients/games";
import GameForm from "../../components/game-form";

export default function GameNew() {
  const router = useRouter();

  const [busy, setBusy] = useState(false);

  /**
   * @param {Game} game
   */
  const onSubmit = async (game) => {
    setBusy(true);

    try {
      const { id } = await createGame(game);
      router.push(`/games/${id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create new game</title>
      </Head>
      <main className={styles.main} aria-busy={busy}>
        <h1>Create new game</h1>
        <GameForm name="My new game" onSubmit={onSubmit}></GameForm>
      </main>
    </>
  );
}
