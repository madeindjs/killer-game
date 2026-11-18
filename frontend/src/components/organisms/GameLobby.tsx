"use client";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import { useId, useMemo } from "react";
import CardSection from "../atoms/CardSection";
import PlayerAvatar from "../molecules/PlayerAvatar";
import GameJoinLink from "./GameJoinLink";
import type { GameRecord, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

/** Minimum number of players required by the API to start a game. */
const MIN_PLAYERS = 2;

interface GameLobbyProps {
  game: GameRecord;
  players: Array<PlayerRecord | PlayerRecordSanitized>;
}

/**
 * Waiting room shown to the organizer before the game starts: players join at
 * their own pace and the organizer sees, in real time, who is in.
 */
export default function GameLobby({ game, players }: GameLobbyProps) {
  const t = useTranslations("games");
  const listId = useId();

  const playersSorted = useMemo(() => {
    const collator = new Intl.Collator();
    return players.filter(Boolean).toSorted((a, b) => collator.compare(a.name, b.name));
  }, [players]);

  const canStart = players.length >= MIN_PLAYERS;

  return (
    <CardSection>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className={STYLES.h2 + " flex-grow"}>⏳ {t("GameLobby.title")}</h2>
        <span className="badge badge-success gap-2" title={t("GameLobby.liveHelp")}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-content opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-content"></span>
          </span>
          {t("GameLobby.live")}
        </span>
      </div>

      <p className="text-4xl font-bold my-2" aria-live="polite">
        {t("GameLobby.playersJoined", { count: players.length })}
      </p>

      <p id={listId} className="sr-only">
        {t("GameLobby.playersList")}
      </p>
      <ul aria-labelledby={listId} className="flex flex-wrap gap-2 my-2">
        {playersSorted.map((player) => (
          <li key={player.id} className="badge badge-lg badge-outline gap-2 py-4">
            <PlayerAvatar player={player} size="xs" />
            <span>{player.name}</span>
          </li>
        ))}
      </ul>

      {canStart ? (
        <p className="text-success">✅ {t("GameLobby.readyToStart")}</p>
      ) : (
        <p className="text-warning">⚠️ {t("GameLobby.notEnoughPlayers", { count: MIN_PLAYERS })}</p>
      )}

      <div className="divider"></div>
      <p>{t("GameLobby.joinHelp")}</p>
      <GameJoinLink game={game} />
    </CardSection>
  );
}
