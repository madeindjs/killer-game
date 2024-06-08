"use client";
import { STYLES } from "@/constants/styles";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useGamesJoined } from "@/hooks/use-games-joined";
import { getPlayerUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { useEffect } from "react";
import { useGame } from "../../hooks/use-game";
import AlertWarning from "../molecules/AlertWarning";
import Fetching from "../molecules/Fetching";
import GameCard from "../organisms/GameCard";

/**
 * @typedef GameCreatedProps
 * @property {import("@killer-game/types").GameRecordSanitized} game
 *
 * @param {GameCreatedProps} param0
 */
function GameJoined({ game, onError }) {
  const { lang } = useTranslation();
  const { loading: loadingGame, error: errorGame } = useGame(game.id);
  const { players, loading: loadingPlayers, error: errorPlayers, load: loadPlayers } = useGamePlayers(game.id);

  useEffect(loadPlayers, [loadPlayers, game.id]);

  useEffect(() => {
    if (errorGame) onError?.(errorGame);
  }, [errorGame, onError]);

  return (
    <Fetching loading={loadingGame} error={errorGame}>
      <Fetching loading={loadingPlayers} error={errorPlayers}>
        {Boolean(game && players) && (
          <GameCard game={game} players={players} url={getPlayerUrl(game, game?.player ?? {}, lang)} />
        )}
      </Fetching>
    </Fetching>
  );
}

export default function GamesJoined() {
  const { removeGame, games } = useGamesJoined();
  const { t } = useTranslation("games-created");

  return (
    <div>
      <h2 className={STYLES.h2}>{t("GamesJoined.title")}</h2>
      {Boolean(games?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1 gap-4">
          {games.map((game) => (
            <GameJoined game={game} key={game.id} onError={() => removeGame(game)} />
          ))}
        </div>
      ) : (
        <AlertWarning>{t("GamesJoined.youDontHaveGames")}</AlertWarning>
      )}
    </div>
  );
}
