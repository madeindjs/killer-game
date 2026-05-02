import { client } from "@/lib/client";
import { useEffect } from "react";

import { SubscriberEventNames } from "@killer-game/types";

/**
 * @typedef GameListenerCallbacks
 * @property {(players: import("@killer-game/types").PlayerRecordSanitized[]) => import("@killer-game/types").PlayerRecordSanitized[]} [setPlayers]
 * @property {(player: import("@killer-game/types").PlayerRecordSanitized) => void} [updatePlayer]
 * @property {(player: import("@killer-game/types").PlayerRecordSanitized) => void} [addPlayer]
 * @property {(player: import("@killer-game/types").PlayerRecordSanitized) => void} [deletePlayer]
 * @property {(player: import("@killer-game/types").GameRecordSanitized) => void} [setGame]
 */

/**
 * @param {string} gameId
 * @param {GameListenerCallbacks} setters
 */
export function useGameEvents(gameId, setters) {
  useEffect(() => {
    if (!gameId) return;

    function onSseEvent(event) {
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
      }
    }

    return client.setupGameListener(gameId, onSseEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);
}
