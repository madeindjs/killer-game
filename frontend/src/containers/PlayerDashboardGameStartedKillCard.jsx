import CardSection from "@/components/CardSection";
import PlayerAvatar from "@/components/PlayerAvatar";
import Token from "@/components/Token";
import { useId, useState } from "react";
import { client } from "../lib/client";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").PlayerRecordSanitized} target
 * @property {import("@killer-game/types").GameActionRecord} action
 *
 *
 * @param {Props} param0
 * @returns
 */
export function PlayerDashboardGameStartedKillCard({ player, target, action }) {
  return (
    <CardSection>
      <p className="card-title">
        You need to kill <strong className="text-primary">{target.name}</strong>
      </p>
      <div className="flex gap-4 mb-3">
        <div className="avatar placeholder">
          <PlayerAvatar player={target} />
        </div>
        <p className="card-title">{target.name}</p>
      </div>
      <p>{action.name}</p>
      <div className="card-actions">
        <KillCardForm playerId={player.id} privateToken={player.private_token} targetId={target.id} />
      </div>
      <div className="divider">OR</div>
      <h2 className="card-title">You get killed ?</h2>
      <p>
        Communicate you killed token: <Token token={player.kill_token}></Token>
      </p>
    </CardSection>
  );
}

/**
 * @param {{playerId: string, privateToken: string, targetId: string}} param0
 */
function KillCardForm({ playerId, privateToken, targetId }) {
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
    <form onSubmit={handleSubmit} aria-busy={busy} className="w-full">
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
      <div className="text-center">
        <input type="submit" className="btn btn-primary" disabled={busy} value="I accomplished the mission" />
      </div>
    </form>
  );
}
