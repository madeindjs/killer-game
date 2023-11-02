import { getPlayerUrl } from "@/lib/routes";
import Link from "next/link";
import Modal from "./Modal";
import PlayerForm from "./PlayerForm";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord | undefined} player
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onPlayerUpdate
 * @property {() => void} onClosed
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 *
 *
 * @param {Props} param0
 * @returns
 */
export default function PlayerModal({ player, actions, onPlayerUpdate, onClosed, onPlayerDelete }) {
  return (
    <Modal
      isOpen={!!player}
      title="Edit the player"
      onClosed={onClosed}
      content={player && <PlayerForm player={player} onChange={onPlayerUpdate} actions={actions} />}
      actions={
        player && (
          <div className="join">
            <Link href={getPlayerUrl(player)} className="btn btn-secondary join-item" target="_blank" prefetch={false}>
              Dashboard
            </Link>
            <button className="btn btn-active btn-warning join-item" onClick={() => onPlayerDelete?.()}>
              delete
            </button>
          </div>
        )
      }
    />
  );
}
