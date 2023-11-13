"use client";
import { useState } from "react";
import { client } from "../../lib/client";
import InputWithLabel from "../atoms/InputWithLabel";

/**
 * @typedef Props
 * @property {string} playerId
 * @property {string} privateToken
 *
 * @param {Props} param0
 */
export default function KillCardForm({ playerId, privateToken, targetId }) {
  const [killToken, setKillToken] = useState(undefined);
  const [busy, setBusy] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    console.log(privateToken);
    setBusy(true);
    client
      .killPlayer(playerId, privateToken, targetId, killToken)
      .then(() => console.log("done"))
      .finally(() => setBusy(false));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <InputWithLabel
        label="Secret token of the player"
        name="name"
        onChange={(name) => setKillToken(name)}
        value={killToken}
        className="mb-3"
        required
      />

      <input type="submit" className="btn btn-primary" disabled={busy} value="I accomplished the mission" />
    </form>
  );
}
