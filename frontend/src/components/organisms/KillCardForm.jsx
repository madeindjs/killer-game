"use client";
import { useId, useState } from "react";
import { client } from "../../lib/client";

/**
 * @param {{playerId: string, privateToken: string, targetId: string}} param0
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

  const killTokenFieldId = useId();

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <div className="form-control w-full mb-3">
        <label className="label" htmlFor={killTokenFieldId}>
          <span className="label-text">Secret token of the player</span>
        </label>
        <input
          className="input input-bordered input-primary w-full"
          type="text"
          name="name"
          id={killTokenFieldId}
          value={killToken}
          onChange={(e) => setKillToken(e.target.value)}
          readOnly={busy}
          required
        />
      </div>
      <input type="submit" className="btn btn-primary" disabled={busy} value="I accomplished the mission" />
    </form>
  );
}
