import Loader from "@/components/atoms/Loader";
import AvatarEditor from "@/components/organisms/AvatarEditor";
import PlayerActionSelector from "@/components/organisms/PlayerActionSelector";
import InputWithLabel from "@/components/server/InputWithLabel";
import { getPlayerAvatarConfig } from "@/utils/player";
import { useTranslations as useTranslation } from "next-intl";
import { Suspense, useId } from "react";

/**
 * @import {PlayerRecord, GameActionsRecord} from '@/models'
 *
 * @typedef PlayerFormProps
 * @property {PlayerRecord | import("@killer-game/types").PlayerRecordSanitized} player
 * @property {GameActionRecord[]} [actions]
 *
 * @param {PlayerFormProps} param0
 */
export default function PlayerForm({ player, actions }) {
  const t = useTranslation("common");

  const avatarConfig = getPlayerAvatarConfig(player);

  const fieldActionId = useId();

  return (
    <div>
      {false && (
        <Suspense fallback={<Loader></Loader>}>
          <AvatarEditor config={avatarConfig} onUpdate={(avatar) => onChange?.({ ...player, avatar })} />
        </Suspense>
      )}

      <InputWithLabel label={t("PlayerForm.nameField")} name="name" value={player.name} className="mb-3" required />

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
