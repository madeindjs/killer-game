"use client";
import { STYLES } from "@/constants/styles";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useEffect } from "react";
import { useGame } from "../../hooks/use-game";
import { useGamesCreated } from "../../hooks/use-games-created";
import Fetching from "../molecules/Fetching";
import GameCard from "../organisms/GameCard";

function GameCreated({ gameId, gamePrivateToken, onError }) {
  const { game, loading: loadingGame, error: errorGame } = useGame(gameId, gamePrivateToken);
  const { players, loading: loadingPlayers, error: errorPlayers } = useGamePlayers(gameId, gamePrivateToken);

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

  if (!games?.length) return <></>;

  return (
    <div>
      <h2 className={STYLES.h2}>Games created</h2>
      <div className="grid grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCreated
            gameId={game.id}
            gamePrivateToken={game.private_token}
            key={game.id}
            onError={() => removeGame(game)}
          />
        ))}
      </div>
    </div>
  );
}
