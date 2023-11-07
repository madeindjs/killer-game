"use client";
import { STYLES } from "@/constants/styles";
import { useGamePlayers } from "@/hooks/use-game-players";
import { DEFAULT_LANG } from "@/lib/i18n";
import { useEffect } from "react";
import { useGame } from "../../hooks/use-game";
import { useGamesCreated } from "../../hooks/use-games-created";
import Fetching from "../molecules/Fetching";
import GameCard from "../organisms/GameCard";

/**
 * @typedef GameCreatedProps
 * @property {import("@/lib/i18n").Lang} lang
 * @property {string} gameId
 * @property {string} gamePrivateToken
 *
 * @param {GameCreatedProps} param0
 */
function GameCreated({ gameId, gamePrivateToken, onError, lang = DEFAULT_LANG }) {
  const { game, loading: loadingGame, error: errorGame } = useGame(gameId, gamePrivateToken);
  const { players, loading: loadingPlayers, error: errorPlayers } = useGamePlayers(gameId, gamePrivateToken);

  useEffect(() => {
    if (errorGame) onError?.(errorGame);
  }, [errorGame, onError]);

  return (
    <Fetching loading={loadingGame} error={errorGame}>
      <Fetching loading={loadingPlayers} error={errorPlayers}>
        {Boolean(game && players) && <GameCard game={game} players={players} lang={lang} />}
      </Fetching>
    </Fetching>
  );
}

/**
 * @typedef Props
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function GamesCreated({ lang = DEFAULT_LANG }) {
  const { removeGame, games } = useGamesCreated();

  if (!games?.length) return <></>;

  const translations = {
    en: {
      title: "Games created",
    },
    fr: {
      title: "Parties crées",
    },
  };

  const t = translations[lang];

  return (
    <div>
      <h2 className={STYLES.h2}>{t.title}</h2>
      <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {games.map((game) => (
          <GameCreated gameId={game.id} gamePrivateToken={game.private_token} key={game.id} lang={lang} />
        ))}
      </div>
    </div>
  );
}
