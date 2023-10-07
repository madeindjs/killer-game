import { getPlayerAvatarConfig } from "@/utils/player";
import AvatarEditor from "./AvatarEditor";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onChange
 */

/**
 * @param {Props} param0
 */
export default function PlayerForm({ player, onChange }) {
  const avatarConfig = getPlayerAvatarConfig(player);
  return (
    <div>
      <p className="text-xl underline mb-2">Avatar</p>
      <AvatarEditor config={avatarConfig} onUpdate={(avatar) => onChange?.({ ...player, avatar })} />
      <p className="text-xl underline mt-3 mb-2">Informations</p>
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
          onChange={(e) => onChange?.({ ...player, name: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
