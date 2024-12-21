"use client";
import { STYLES } from "@/constants/styles";
import { ToastContext, ToastProvider } from "@/context/Toast";
import { useGameEvents } from "@/hooks/use-game-events";
import { useGamePlayersList } from "@/hooks/use-game-players-list";
import { useGameToast } from "@/hooks/use-game-toast";
import { client } from "@/lib/client";
import { getPlayerUrl } from "@/lib/routes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AlertWarning from "../molecules/AlertWarning";
import PlayerCreateForm from "../organisms/PlayerCreateForm";
import PlayersAvatars from "../organisms/PlayersAvatars";

/**
 * @typedef GameJoinContentProps
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 *
 * @param {GameJoinContentProps} param0
 */
function GameJoinContent({ game, setGame, ...props }) {
  const t = useTranslations("games");
  const tJoin = useTranslations("game-join");
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);
  const lang = useLocale();

  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayersList(
    props.players,
  );

  function onAddPlayer(player) {
    addPlayer(player);
    gameToast.player.created.success(player);
  }

  function onDeletePlayer(player) {
    deletePlayer(player);
    gameToast.player.removed.success(player);
  }

  useGameEvents(game.id, {
    addPlayer: onAddPlayer,
    deletePlayer: onDeletePlayer,
    updatePlayer,
    setGame,
  });

  const [gameCreateBusy, setGameCreateBusy] = useState(false);
  const [gameCreateError, setGameCreateError] = useState();

  const router = useRouter();

  function handlePlayerCreate(player) {
    setGameCreateBusy(true);
    client
      .createPlayer(game.id, player)
      .then((player) => router.push(getPlayerUrl(game, player, lang)))
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
            {tJoin("GameJoinContent.thereIsAlreadyXPlayers", {
              count: players?.length ?? 0,
            })}
          </p>
          <div className="overflow-x-auto">
            <PlayersAvatars players={players} className="justify-center" />
          </div>
        </div>
        <div className="card flex-shrink-0 w-full max-w-xl shadow-2xl bg-base-100">
          <div className="card-body">
            <PlayerCreateForm
              onSubmit={handlePlayerCreate}
              busy={gameCreateBusy || !!game.started_at}
            />
            {game.started_at && (
              <AlertWarning>
                {t("GameJoin.gameAlreadyStartedWaring")} 🫠
              </AlertWarning>
            )}
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
 * @property {import("@killer-game/types").GameRecord} game
 * @property {import("@killer-game/types").PlayerRecordSanitized[]} players
 *
 * @param {GameJoinProps} props
 */
export default function GameJoin(props) {
  const [game, setGame] = useState(props.game);

  return (
    <ToastProvider>
      <GameJoinContent game={game} setGame={setGame} players={props.players} />
    </ToastProvider>
  );
}
