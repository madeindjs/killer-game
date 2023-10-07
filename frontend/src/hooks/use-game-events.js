import { setupGameListener2 } from "@/lib/client";
import { useEffect } from "react";

import { SubscriberEventNames } from "@killer-game/types";

/**
 * @typedef GameListenerCallbacks
 * @property {(players: import("@killer-game/types").PlayerRecord[]) => import("@killer-game/types").PlayerRecord[]} [setPlayers]
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
          return setters.setPlayers?.((old) => [...old, event.payload]);

        case SubscriberEventNames.PlayerUpdated: {
          /** @type {import("@killer-game/types").PlayerRecord} */
          const player = event.payload;

          setters.setPlayers?.((old) => {
            const copy = [...old];
            const index = old.findIndex((o) => o.id === player.id);
            copy[index] = player;

            return copy;
          });
        }

        case SubscriberEventNames.PlayerDeleted: {
          /** @type {import("@killer-game/types").PlayerRecord} */
          const player = event.payload;
          return setters.setPlayers?.((p) => p.filter((o) => o.id !== player.id));
        }
      }
    }

    return setupGameListener2(gameId, onSseEvent);
  }, [gameId, setters]);
}
