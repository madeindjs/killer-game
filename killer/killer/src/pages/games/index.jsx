import GameList from "@/components/games-list";
import styles from "@/styles/Home.module.css";
import Head from "next/head";

export default function Games() {
  return (
    <>
      <Head>
        <title>My games</title>
      </Head>
      <main className={styles.main}>
        <h1>My games</h1>
        <GameList />
      </main>
    </>
  );
}
