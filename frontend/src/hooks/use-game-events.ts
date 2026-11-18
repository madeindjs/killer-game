import { client } from "@/lib/client";
import { useEffect } from "react";

import { SubscriberEventNames } from "@killer-game/types";
import type { GamePresence, GameRecordSanitized, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

export interface GameListenerCallbacks {
  setPlayers?: (players: PlayerRecordSanitized[]) => PlayerRecordSanitized[];
  updatePlayer?: (player: PlayerRecordSanitized) => void;
  addPlayer?: (player: PlayerRecordSanitized) => void;
  deletePlayer?: (player: PlayerRecordSanitized) => void;
  setGame?: (game: GameRecordSanitized) => void;
  /** Called with the players currently connected to the game. */
  setPresence?: (presence: GamePresence) => void;
}

export interface GameListenerOptions {
  /** Identify the listening player, so they are marked as connected to the game. */
  player?: Pick<PlayerRecord, "id" | "private_token">;
}

interface GameEvent {
  event: string;
  payload: any;
}

export function useGameEvents(
  gameId: string | undefined,
  setters: GameListenerCallbacks,
  { player }: GameListenerOptions = {},
): void {
  const playerId = player?.id;
  const playerToken = player?.private_token;

  useEffect(() => {
    if (!gameId) return;

    function onSseEvent(event: GameEvent) {
      console.log("Server sent event", event);
      switch (event.event) {
        case SubscriberEventNames.GameCreated:
          break;

        case SubscriberEventNames.GameUpdated:
          setters.setGame?.(event.payload);
          break;

        case SubscriberEventNames.GameDeleted:
          break;

        case SubscriberEventNames.PlayerCreated:
          return setters.addPlayer?.(event.payload);

        case SubscriberEventNames.PlayerUpdated:
          return setters.updatePlayer?.(event.payload);

        case SubscriberEventNames.PlayerDeleted:
          return setters.deletePlayer?.(event.payload);

        case SubscriberEventNames.PlayerPresence:
          return setters.setPresence?.(event.payload);
      }
    }

    const listener =
      playerId && playerToken ? { id: playerId, private_token: playerToken } : undefined;

    return client.setupGameListener(gameId, onSseEvent, listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, playerId, playerToken]);
}
