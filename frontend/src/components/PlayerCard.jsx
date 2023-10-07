import { getPlayerAvatarConfig } from "@/utils/player";
import Link from "next/link";
import { useState } from "react";
import AvatarEditor from "./AvatarEditor";
import Modal from "./Modal";
import PlayerAvatar from "./PlayerAvatar";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {boolean} [editable]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onUpdate]
 */

/**
 * @param {Props} param0
 * @returns
 */
export function PlayerCard({ player, onUpdate, editable }) {
  const [showEditModal, setShowEditModal] = useState();

  const avatarConfig = getPlayerAvatarConfig(player);

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
                <button type="button" class="btn join-item" onClick={() => setShowEditModal(true)}>
                  Edit
                </button>
              )}

              <Link href={`/games/${player.game_id}/players/${player.id}`} className="btn btn-secondary join-item">
                Buy Now
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
          content={
            <>
              <p class="text-xl underline mb-2">Avatar</p>
              <AvatarEditor config={avatarConfig} onUpdate={(avatar) => onUpdate?.({ ...player, avatar })} />
              <p class="text-xl underline mt-3 mb-2">Informations</p>
              <div className="form-control w-full mb-3">
                <label className="label">
                  <span className="label-text">Name of the player</span>
                </label>
                <input
                  className="input input-bordered input-primary w-full"
                  type="text"
                  name="name"
                  id="player__name"
                  value={player.name}
                  onChange={(e) => onUpdate?.({ ...player, name: e.target.value })}
                  required
                />
              </div>
            </>
          }
        />
      )}
    </>
  );
}
