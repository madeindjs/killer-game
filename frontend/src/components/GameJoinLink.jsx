"use client";
import { getGameJoinUrl } from "@/lib/routes";
import copy from "copy-to-clipboard";
import { useCallback, useEffect, useState } from "react";

/**
 * @param {{game:import("@killer-game/types").GameRecord}} param0
 */
export default function GameJoinLink({ game }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState();

  useEffect(() => {
    const url = new URL(window.location);
    url.pathname = getGameJoinUrl(game);
    setUrl(url.toString());
  }, [game]);

  const copyToClipboard = useCallback(() => {
    copy(url) && setMessage("Copied to the clipboard!");
    setTimeout(() => setMessage(undefined), 5_000);
  }, [url]);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">URL to join the game</span>
      </label>
      <input type="text" className="input input-bordered w-full" readOnly value={url} onClick={copyToClipboard} />
      {message && <p className="text-success mt-2">{message}</p>}
      {game.started_at && (
        <p className="text-warning mt-2">The game started, you cannot invite new persons in the game.</p>
      )}
    </div>
  );
}
