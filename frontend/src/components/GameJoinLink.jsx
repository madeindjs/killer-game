"use client";
import { getGameJoinUrl } from "@/lib/routes";
import { useEffect, useState } from "react";

/**
 *
 * @param {{game:import("@killer-game/types").GameRecord}} param0
 */
export default function GameJoinLink({ game }) {
  const [url, setUrl] = useState();

  useEffect(() => {
    const url = new URL(window.location);
    url.pathname = getGameJoinUrl(game);
    setUrl(url.toString());
  }, [game]);

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">URL to join the game</span>
      </label>
      <input type="text" className="input input-bordered w-full max-w-xs" readOnly value={url} />
    </div>
  );
}