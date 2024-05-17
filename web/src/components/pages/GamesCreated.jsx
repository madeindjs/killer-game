"use client";
import { STYLES } from "@/constants/styles";
import { useGamePlayers } from "@/hooks/use-game-players";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import { useGame } from "../../hooks/use-game";
import { useGamesCreated } from "../../hooks/use-games-created";
import AlertWarning from "../molecules/AlertWarning";
import Fetching from "../molecules/Fetching";
import GameCard from "../organisms/GameCard";

/**
 * @typedef GameCreatedProps
 * @property {string} gameId
 * @property {string} gamePrivateToken
 *
 * @param {GameCreatedProps} param0
 */
function GameCreated({ gameId, gamePrivateToken, onError }) {
  const { game, loading: loadingGame, error: errorGame } = useGame(gameId, gamePrivateToken);
  const {
    players,
    loading: loadingPlayers,
    error: errorPlayers,
    load: loadPlayers,
  } = useGamePlayers(gameId, gamePrivateToken);

  useEffect(loadPlayers, [loadPlayers, gameId, gamePrivateToken]);

  useEffect(() => {
    if (errorGame) onError?.(errorGame);
  }, [errorGame, onError]);

  return (
    <Fetching loading={loadingGame} error={errorGame}>
      <Fetching loading={loadingPlayers} error={errorPlayers}>
        {Boolean(game && players) && <GameCard game={game} players={players} />}
      </Fetching>
    </Fetching>
  );
}

export default function GamesCreated() {
  const { removeGame, games } = useGamesCreated();
  const { t } = useTranslation("games-created");

  return (
    <div>
      <h2 className={STYLES.h2}>{t("GamesCreated.title")}</h2>
      {Boolean(games?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1 gap-4">
          {games.map((game) => (
            <GameCreated
              gameId={game.id}
              gamePrivateToken={game.private_token}
              key={game.id}
              onError={() => removeGame(game)}
            />
          ))}
        </div>
      ) : (
        <AlertWarning>{t("GamesCreated.youDontHaveGames")}</AlertWarning>
      )}
    </div>
  );
}
