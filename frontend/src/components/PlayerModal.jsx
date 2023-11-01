import { useEffect, useState } from "react";
import Modal from "./Modal";
import PlayerForm from "./PlayerForm";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord | undefined} player
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onPlayerUpdate
 * @property {() => void} onPlayerUpdate

 * @property {() => void} onClosed
 *
 *
 * @param {Props} param0
 * @returns
 */
export default function PlayerModal({ player, onPlayerUpdate, onClosed, onPlayerDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(Boolean(player));
  }, [player, setIsOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title="Edit the player"
      onClosed={onClosed}
      content={player && <PlayerForm player={player} onChange={onPlayerUpdate} />}
      actions={
        player && (
          <>
            <button className="btn btn-active btn-link text-error" onClick={() => onPlayerDelete?.()}>
              delete
            </button>
          </>
        )
      }
    />
  );
}
