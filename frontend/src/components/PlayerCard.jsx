import { getPlayerUrl } from "@/lib/routes";
import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import PlayerAvatar from "./PlayerAvatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {boolean} [editable]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onUpdate]
 * @property {() => void} [onDelete]

 */

/**
 * @param {Props} param0
 * @returns
 */
export function PlayerCard({ player, onUpdate, onDelete, editable }) {
  const [showEditModal, setShowEditModal] = useState();

  return (
    <>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="avatar placeholder">
            <PlayerAvatar player={player} />
          </div>
          <p className="card-title">{player.name}</p>
          <div className="card-actions justify-end">
            <div className="join">
              {editable && (
                <>
                  <button type="button" className="btn join-item" onClick={() => onDelete?.()}>
                    Delete
                  </button>
                  <button type="button" className="btn join-item" onClick={() => setShowEditModal(true)}>
                    Edit
                  </button>
                </>
              )}

              <Link href={getPlayerUrl(player)} className="btn btn-secondary join-item">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      {editable && (
        <Modal
          isOpen={showEditModal}
          title="Edit the player"
          onClosed={() => setShowEditModal(false)}
          content={<PlayerForm player={player} onChange={(e) => onUpdate?.(e)} />}
        />
      )}
    </>
  );
}
