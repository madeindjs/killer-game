"use client";

import { STYLES } from "@/constants/styles";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGame } from "@/hooks/use-game";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayers } from "@/hooks/use-game-players";
import { useGameToast } from "@/hooks/use-game-toast";
import { client } from "@/lib/client";
import { getPlayerUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AlertWarning from "../molecules/AlertWarning";
import Fetching from "../molecules/Fetching";
import PlayerCreateForm from "../organisms/PlayerCreateForm";
import PlayersAvatars from "../organisms/PlayersAvatars";

/**
 * @typedef GameJoinContentProps
 * @property {import("@killer-game/types").GameRecordSanitized} game
 *
 * @param {GameJoinContentProps} param0
 */
function GameJoinContent({ game, setGame }) {
  const { t } = useTranslation("games");
  const { t: tCommon } = useTranslation("common");
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);

  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayers(game.id);

  function onAddPlayer(player) {
    addPlayer(player);
    gameToast.player.created.success(player);
  }

  function onDeletePlayer(player) {
    deletePlayer(player);
    gameToast.player.removed.success(player);
  }

  useGameEvents(game.id, { addPlayer: onAddPlayer, deletePlayer: onDeletePlayer, updatePlayer, setGame });

  const [gameCreateBusy, setGameCreateBusy] = useState(false);
  const [gameCreateError, setGameCreateError] = useState();

  const router = useRouter();

  function handlePlayerCreate(player) {
    setGameCreateBusy(true);
    client
      .createPlayer(game.id, player)
      .then((player) => router.push(getPlayerUrl(player)))
      .catch(setGameCreateError)
      .finally(() => setGameCreateBusy(false));
  }

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className={STYLES.h1}>{t("GameJoin.title")}</h1>
          <p className="my-6 text-xl">{t("GameJoin.description1")}</p>
          <p className="my-6 text-xl">
            There is already <strong>{tCommon("count.players", { count: players.length })}</strong> in the game.
          </p>
          <div className="overflow-x-auto">
            <PlayersAvatars players={players} className="justify-center" />
          </div>
        </div>
        <div className="card flex-shrink-0 w-full max-w-xl shadow-2xl bg-base-100">
          <div className="card-body">
            <PlayerCreateForm onSubmit={handlePlayerCreate} busy={gameCreateBusy || game.started_at} i18n={{}} />
            {game.started_at && <AlertWarning>{t("GameJoin.gameAlreadyStartedWaring")} 🫠</AlertWarning>}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef GameJoinI18n
 * @property {import("../organisms/PlayerCreateForm").PlayerCreateFormI18n} PlayerCreateForm
 * @property {string} title
 *
 * @typedef GameJoinProps
 * @property {string} gameId
 *
 * @param {GameJoinProps} param0
 */
export default function GameJoin({ gameId }) {
  const { error: gameError, loading: gameLoading, game, setGame } = useGame(gameId);

  return (
    <Fetching loading={gameLoading} error={gameError}>
      <ToastProvider>{game && <GameJoinContent game={game} setGame={setGame} />}</ToastProvider>
    </Fetching>
  );
}
