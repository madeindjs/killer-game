import useTranslation from "next-translate/useTranslation";
import CardSection from "../atoms/CardSection";
import Token from "../atoms/Token";
import PlayerAvatar from "../molecules/PlayerAvatar";
import KillCardForm from "./KillCardForm";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {import("@killer-game/types").PlayerRecordSanitized} target
 * @property {import("@killer-game/types").GameActionRecord} action
 * @property {() => void} [onKill]
 *
 *
 * @param {Props} param0
 * @returns
 */
export function PlayerDashboardGameStartedKillCard({ player, target, action, onKill }) {
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
        <KillCardForm playerId={player.id} privateToken={player.private_token} targetId={target.id} onKill={onKill} />
      </div>
      <div className="divider">{t("PlayerDashboardGameStartedKillCard.or")}</div>
      <h2 className="card-title">{t("PlayerDashboardGameStartedKillCard.youGetKilled")}</h2>
      <p>
        {t("PlayerDashboardGameStartedKillCard.communicateYourKilledToken")}: <Token token={player.kill_token}></Token>
      </p>
    </CardSection>
  );
}
