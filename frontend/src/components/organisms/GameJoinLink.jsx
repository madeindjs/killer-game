"use client";
import { getGameJoinUrl } from "@/lib/routes";
import copy from "copy-to-clipboard";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useEffect, useState } from "react";

/**
 * @typedef GameJoinLinkProps
 * @property {import("@killer-game/types").GameRecord} game
 *
 * @param {GameJoinLinkProps} param0
 */
export default function GameJoinLink({ game }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState();
  const { t } = useTranslation("games");

  useEffect(() => {
    const url = new URL(window.location);
    url.pathname = getGameJoinUrl(game);
    setUrl(url.toString());
  }, [game]);

  const copyToClipboard = useCallback(() => {
    copy(url) && setMessage(t("GameJoinLink.copiedToTheClipboard"));
    setTimeout(() => setMessage(undefined), 5_000);
  }, [url]);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{t("GameJoinLink.urlField")}</span>
      </label>
      <input type="text" className="input input-bordered w-full" readOnly value={url} onClick={copyToClipboard} />
      {message && <p className="text-success mt-2">{message}</p>}
      {game.started_at && <p className="text-warning mt-2">{t("GameJoinLink.gameStartedWarning")}</p>}
    </div>
  );
}
