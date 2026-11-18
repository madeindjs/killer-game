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
import type {
  GameRecord,
  GameRecordSanitized,
  PlayerCreateDTO,
  PlayerRecordSanitized,
} from "@killer-game/types";
import HeroWithCard from "../atoms/HeroWithCard";
import AlertWarning from "../molecules/AlertWarning";
import PlayerCreateForm from "../organisms/PlayerCreateForm";
import PlayersAvatars from "../organisms/PlayersAvatars";

type Game = GameRecord | GameRecordSanitized;

interface GameJoinContentProps {
  game: Game;
  setGame: (game: Game) => void;
  players: PlayerRecordSanitized[];
}

function GameJoinContent({ game, setGame, ...props }: GameJoinContentProps) {
  const t = useTranslations("games");
  const tJoin = useTranslations("game-join");
  const { push } = useContext(ToastContext);
  const gameToast = useGameToast(push);
  const lang = useLocale();

  const { players, addPlayer, deletePlayer, updatePlayer } = useGamePlayersList(
    props.players,
  );

  function onAddPlayer(player: PlayerRecordSanitized) {
    addPlayer(player);
    gameToast.player.created.success(player);
  }

  function onDeletePlayer(player: PlayerRecordSanitized) {
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
  const [, setGameCreateError] = useState<unknown>();

  const router = useRouter();

  function handlePlayerCreate(
    player: PlayerCreateDTO | PlayerRecordSanitized,
    avatarFile?: File,
  ) {
    setGameCreateBusy(true);
    client
      .createPlayer(game.id, player as PlayerCreateDTO)
      .then((createdPlayer) => {
        if (avatarFile) {
          return client
            .uploadPlayerAvatarImage(createdPlayer.id, createdPlayer.private_token, avatarFile)
            .then(() => createdPlayer);
        }
        return createdPlayer;
      })
      .then((createdPlayer) => router.push(getPlayerUrl(game, createdPlayer, lang)))
      .catch(setGameCreateError)
      .finally(() => setGameCreateBusy(false));
  }

  return (
    <HeroWithCard
      side={
        <>
          <h1 className={STYLES.h1}>{t("GameJoin.title")}</h1>
          <p className="my-6 text-xl">{t("GameJoin.description1")}</p>
          <p className="my-6 text-xl">
            {tJoin("GameJoinContent.thereIsAlreadyXPlayers", {
              count: players?.length ?? 0,
            })}
          </p>
          <div className="overflow-x-auto">
            <PlayersAvatars players={players} className="justify-center lg:justify-start" />
          </div>
        </>
      }
      card={
        <>
          <PlayerCreateForm
            onSubmit={handlePlayerCreate}
            busy={gameCreateBusy || !!game.started_at}
          />
          {game.started_at && (
            <AlertWarning>{t("GameJoin.gameAlreadyStartedWaring")} 🫠</AlertWarning>
          )}
        </>
      }
    />
  );
}

interface GameJoinProps {
  game: Game;
  players: PlayerRecordSanitized[];
}

export default function GameJoin(props: GameJoinProps) {
  const [game, setGame] = useState<Game>(props.game);

  return (
    <ToastProvider>
      <GameJoinContent game={game} setGame={setGame} players={props.players} />
    </ToastProvider>
  );
}
