import { setupGameListener2 } from "@/lib/client";
import { useEffect } from "react";

import { SubscriberEventNames } from "@killer-game/types";

/**
 * @typedef GameListenerCallbacks
 * @property {(players: import("@killer-game/types").PlayerRecord[]) => import("@killer-game/types").PlayerRecord[]} [setPlayers]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [updatePlayer]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [addPlayer]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} [deletePlayer]
 */

/**
 * @param {string} gameId
 * @param {GameListenerCallbacks} setters
 */
export function useGameEvents(gameId, setters) {
  useEffect(() => {
    if (!gameId) return;

    function onSseEvent(event) {
      switch (event.event) {
        case SubscriberEventNames.GameCreated:
          break;

        case SubscriberEventNames.GameUpdated:
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

    return setupGameListener2(gameId, onSseEvent);
  }, [gameId, setters]);
}
