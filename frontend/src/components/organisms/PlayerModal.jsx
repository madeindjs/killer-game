import { useTranslations } from "next-intl";
import Modal from "../molecules/Modal";
import PlayerForm from "./PlayerForm";

/**
 * @typedef PlayerModalProps
 * @property {import("@killer-game/types").PlayerRecord | undefined} player
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onPlayerUpdate
 * @property {() => void} onPlayerDelete
 * @property {() => void} onClosed
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 *
 * @param {PlayerModalProps} param0
 * @returns
 */
export default function PlayerModal({ player, actions, onPlayerUpdate, onClosed, onPlayerDelete }) {
  const t = useTranslations("common");
  return (
    <Modal
      isOpen={!!player}
      title="Edit the player"
      onClosed={onClosed}
      content={player && <PlayerForm player={player} onChange={onPlayerUpdate} actions={actions} />}
      actions={
        player && (
          <div className="join">
            <button className="btn btn-link text-error join-item" onClick={() => onPlayerDelete?.()}>
              {t("delete")}
            </button>
          </div>
        )
      }
    />
  );
}
