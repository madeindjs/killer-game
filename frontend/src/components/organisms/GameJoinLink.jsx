"use client";
import { getGameJoinUrl } from "@/lib/routes";
import { useTranslations as useTranslation } from "next-intl";
import { useEffect, useRef, useState } from "react";

/**
 * @typedef GameJoinLinkProps
 * @property {import("@killer-game/types").GameRecord} game
 *
 * @param {GameJoinLinkProps} param0
 */
export default function GameJoinLink({ game }) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState();
  const t = useTranslation("games");

  useEffect(() => {
    const url = new URL(getGameJoinUrl(game), window.location);
    setUrl(url.toString());
  }, [game]);

  function copyToClipboard() {
    inputRef.current.select();
    document.execCommand("copy");
    setMessage(t("GameJoinLink.copiedToTheClipboard"));
    setTimeout(() => setMessage(undefined), 5_000);
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{t("GameJoinLink.urlField")}</span>
      </label>
      <input
        type="text"
        className="input input-bordered w-full"
        readOnly
        value={url}
        onClick={copyToClipboard}
        ref={inputRef}
      />
      {message && <p className="text-success mt-2">{message}</p>}
      {game.started_at && <p className="text-warning mt-2">{t("GameJoinLink.gameStartedWarning")}</p>}
    </div>
  );
}
