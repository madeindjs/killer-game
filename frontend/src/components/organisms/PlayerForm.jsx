import { getPlayerAvatarConfig } from "@/utils/player";
import useTranslation from "next-translate/useTranslation";
import { Suspense, useId } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import Loader from "../atoms/Loader";
import AvatarEditor from "./AvatarEditor";
import PlayerActionSelector from "./PlayerActionSelector";

/**
 * @typedef PlayerFormProps
 * @property {import("@killer-game/types").PlayerRecord | import("@killer-game/types").PlayerRecordSanitized} player
 * @property {import("@killer-game/types").GameActionRecord[]} [actions]
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onChange
 *
 * @param {PlayerFormProps} param0
 */
export default function PlayerForm({ player, actions, onChange }) {
  const { t } = useTranslation("games");

  const avatarConfig = getPlayerAvatarConfig(player);

  const fieldActionId = useId();

  return (
    <div>
      <Suspense fallback={<Loader></Loader>}>
        <AvatarEditor config={avatarConfig} onUpdate={(avatar) => onChange?.({ ...player, avatar })} />
      </Suspense>
      <InputWithLabel
        label={t("PlayerForm.nameField")}
        name="name"
        onChange={(name) => onChange?.({ ...player, name })}
        value={player.name}
        className="mb-3"
        required
      />

      {!!actions?.length && (
        <div className="form-control w-full mb-3">
          <label className="label" htmlFor={fieldActionId}>
            <span className="label-text">{t("PlayerForm.actionField")}</span>
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
