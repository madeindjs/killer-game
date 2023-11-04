/**
 *
 * @param {(level: string, message: string) => void} push
 */
export function useGameToast(pushToast) {
  return {
    player: {
      created: {
        /**
         * @param {import("@killer-game/types").PlayerRecordSanitized} player
         */
        success: (player) => pushToast("success", `👯 ${player.name} joined the game`),
        /**
         * @param {import("@killer-game/types").PlayerRecordSanitized} player
         */
        error: (player) => pushToast("error", `🔥 An error occurred, the player ${player.name} was not created.`),
      },
      updated: {
        /**
         * @param {import("@killer-game/types").PlayerRecordSanitized} player
         */
        success: (player) => pushToast("success", `✅ ${player.name} was updated.`),
        /**
         * @param {import("@killer-game/types").PlayerRecordSanitized} player
         */
        error: (player) => pushToast("error", `🔥 An error occurred, the player ${player.name} was not updated.`),
      },
      removed: {
        /**
         * @param {import("@killer-game/types").PlayerRecordSanitized} player
         */
        success: (player) => pushToast("success", `😢 ${player.name} leaved the game.`),
        /**
         * @param {import("@killer-game/types").PlayerRecordSanitized} player
         */
        error: (player) => pushToast("error", `🔥 An error occurred, the player ${player.name} was not removed.`),
      },
    },
  };
}
