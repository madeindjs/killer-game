import { DEFAULT_LANG } from "@/lib/i18n";
import { getPlayerAvatarConfig } from "@/utils/player";
import { Suspense, useId } from "react";
import Loader from "../atoms/Loader";
import AvatarEditor from "./AvatarEditor";
import PlayerActionSelector from "./PlayerActionSelector";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecord | import("@killer-game/types").PlayerRecordSanitized} player
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onChange
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function PlayerForm({ player, actions, onChange, lang = DEFAULT_LANG }) {
  const avatarConfig = getPlayerAvatarConfig(player);

  const fieldNameId = useId();
  const fieldActionId = useId();

  return (
    <div>
      <Suspense fallback={<Loader></Loader>}>
        <AvatarEditor config={avatarConfig} onUpdate={(avatar) => onChange?.({ ...player, avatar })} lang={lang} />
      </Suspense>
      <div className="form-control w-full mb-3">
        <label className="label" htmlFor={fieldNameId}>
          <span className="label-text">Name of the player</span>
        </label>
        <input
          className="input input-bordered input-primary w-full"
          type="text"
          name="name"
          id={fieldNameId}
          value={player.name}
          onChange={(e) => onChange?.({ ...player, name: e.target.value })}
          required
        />
      </div>
      {!!actions?.length && (
        <div className="form-control w-full mb-3">
          <label className="label" htmlFor={fieldActionId}>
            <span className="label-text">Action to kill him</span>
          </label>
          <PlayerActionSelector
            id={fieldActionId}
            value={player.action_id}
            actions={actions}
            onChange={(e) => onChange?.({ ...player, action_id: e })}
          />
        </div>
      )}
    </div>
  );
}
