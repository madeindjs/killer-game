import type { PlayerRecordSanitized } from "@killer-game/types";
import { useTranslations } from "next-intl";

export function useGameToast(
  pushToast: (level: string, message: string) => void,
) {
  const t = useTranslations("toasts");
  return {
    player: {
      created: {
        success: (player: PlayerRecordSanitized) =>
          pushToast(
            "success",
            `👯 ${t("player.created.success", { player: player.name })}`,
          ),
        error: (player: PlayerRecordSanitized) =>
          pushToast(
            "error",
            `🔥 ${t("player.created.error", { player: player.name })}`,
          ),
      },
      updated: {
        success: (player: PlayerRecordSanitized) =>
          pushToast(
            "success",
            `✅ ${t("player.updated.success", { player: player.name })}`,
          ),
        error: (player: PlayerRecordSanitized) =>
          pushToast(
            "error",
            `🔥 ${t("player.updated.error", { player: player.name })}`,
          ),
      },
      removed: {
        success: (player: PlayerRecordSanitized) =>
          pushToast(
            "success",
            `😢 ${t("player.removed.success", { player: player.name })}`,
          ),
        error: (player: PlayerRecordSanitized) =>
          pushToast(
            "error",
            `🔥 ${t("player.removed.error", { player: player.name })}`,
          ),
      },
    },
  };
}
