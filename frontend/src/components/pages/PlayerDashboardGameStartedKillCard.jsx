import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { client } from "../../lib/client";
import CardSection from "../atoms/CardSection";
import InputWithLabel from "../atoms/InputWithLabel";
import Token from "../atoms/Token";
import PlayerAvatar from "../molecules/PlayerAvatar";

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
  const { t } = useTranslation("player-dashboard");
  return (
    <CardSection>
      <p className="card-title">{t("PlayerDashboardGameStartedKillCard.yourCurrentMission")}</p>

      <div className="flex gap-4 mb-3">
        <div className="avatar placeholder">
          <PlayerAvatar player={target} />
        </div>
        <p className="card-title">{target.name}</p>
      </div>
      <p>
        {t("PlayerDashboardGameStartedKillCard.youNeedToKill")} <strong className="text-primary">{target.name}</strong>
        .&nbsp;{t("PlayerDashboardGameStartedKillCard.youNeedToMakeHimDo")}&nbsp;
        <strong className="text-primary">{action.name}</strong>
      </p>
      <p className="mb-4">{t("PlayerDashboardGameStartedKillCard.onceDone")}</p>
      <div className="card-actions">
        <KillCardForm playerId={player.id} privateToken={player.private_token} targetId={target.id} />
      </div>
      <div className="divider">{t("PlayerDashboardGameStartedKillCard.or")}</div>
      <h2 className="card-title">{t("PlayerDashboardGameStartedKillCard.youGetKilled")}</h2>
      <p>
        {t("PlayerDashboardGameStartedKillCard.communicateYourKilledToken")}: <Token token={player.kill_token}></Token>
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

  return (
    <form onSubmit={handleSubmit} aria-busy={busy} className="w-full">
      <InputWithLabel
        label="Secret token of the player"
        name="name"
        onChange={(name) => setKillToken({ ...player, name })}
        value={killToken}
        className="mb-3"
        readOnly={busy}
        required
      />
      <div className="text-center">
        <input type="submit" className="btn btn-primary" disabled={busy} value="I accomplished the mission" />
      </div>
    </form>
  );
}
