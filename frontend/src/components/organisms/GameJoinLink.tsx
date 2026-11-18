"use client";
import { useLocationOrigin } from "@/hooks/use-location";
import { getGameInviteUrl } from "@/lib/routes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import InputCopyToClipBoard from "./InputCopyToClipBoard";
import type { GameRecord, GameRecordSanitized } from "@killer-game/types";

interface GameJoinLinkProps {
  game: GameRecord | GameRecordSanitized;
}

export default function GameJoinLink({ game }: GameJoinLinkProps) {
  const t = useTranslations("games");

  const origin = useLocationOrigin();
  const url = getGameInviteUrl(game, origin);

  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  function share() {
    navigator
      .share({
        title: game.name,
        text: t("GameJoinLink.shareText", { name: game.name }),
        url,
      })
      // the user dismissed the share sheet: nothing to do
      .catch(() => {});
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{t("GameJoinLink.urlField")}</span>
      </label>
      <div className="flex gap-2 items-start">
        <div className="flex-grow">
          <InputCopyToClipBoard value={url} />
        </div>
        {canShare && (
          <button type="button" className="btn btn-primary" onClick={share}>
            📤 {t("GameJoinLink.share")}
          </button>
        )}
      </div>
      <p className="text-sm opacity-70 mt-2">{t("GameJoinLink.hint")}</p>
      {game.started_at && (
        <p className="text-warning mt-2">{t("GameJoinLink.gameStartedWarning")}</p>
      )}
    </div>
  );
}
