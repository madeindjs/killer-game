"use client";
import { STYLES } from "@/constants/styles";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useEffect } from "react";
import { useGame } from "../../hooks/use-game";
import { useGamesCreated } from "../../hooks/use-games-created";
import Fetching from "../molecules/Fetching";
import GameCard from "../organisms/GameCard";

/**
 * @typedef GameCreatedProps
 * @property {string} gameId
 * @property {string} gamePrivateToken
 * @property {string} i18nSeeGame
 * @property {string} i18nProgress
 * @property {string} i18nPending
 *
 * @param {GameCreatedProps} param0
 */
function GameCreated({ gameId, gamePrivateToken, onError, i18nSeeGame, i18nPending, i18nProgress }) {
  const { game, loading: loadingGame, error: errorGame } = useGame(gameId, gamePrivateToken);
  const { players, loading: loadingPlayers, error: errorPlayers } = useGamePlayers(gameId, gamePrivateToken);

  useEffect(() => {
    if (errorGame) onError?.(errorGame);
  }, [errorGame, onError]);

  return (
    <Fetching loading={loadingGame} error={errorGame}>
      <Fetching loading={loadingPlayers} error={errorPlayers}>
        {Boolean(game && players) && (
          <GameCard
            game={game}
            players={players}
            i18nSeeGame={i18nSeeGame}
            i18nPending={i18nPending}
            i18nProgress={i18nProgress}
          />
        )}
      </Fetching>
    </Fetching>
  );
}

/**
 * @typedef Props
 * @property {string} title
 * @property {string} i18nSeeGame
 * @property {string} i18nProgress
 * @property {string} i18nPending
 *
 * @param {Props} param0
 */
export default function GamesCreated({ title, i18nSeeGame, i18nPending, i18nProgress }) {
  const { removeGame, games } = useGamesCreated();

  if (!games?.length) return <></>;

  return (
    <div>
      <h2 className={STYLES.h2}>{title}</h2>
      <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {games.map((game) => (
          <GameCreated
            gameId={game.id}
            gamePrivateToken={game.private_token}
            key={game.id}
            onError={removeGame}
            i18nSeeGame={i18nSeeGame}
            i18nPending={i18nPending}
            i18nProgress={i18nProgress}
          />
        ))}
      </div>
    </div>
  );
}
