import { getPlayerAvatarConfig } from "@/utils/avatar";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import Loader from "../atoms/Loader";
import AvatarEditor from "./AvatarEditor";
import PlayerActionInput from "./PlayerActionInput";

/**
 * @typedef PlayerFormProps
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {(player: import("@killer-game/types").PlayerRecord) => void} onChange
 * @property {boolean} [allowChangeAction]
 *
 * @param {PlayerFormProps} props
 */
export default function PlayerForm(props) {
  const t = useTranslations("games.PlayerForm");

  const avatarConfig = getPlayerAvatarConfig(props.player);

  return (
    <div>
      <Suspense fallback={<Loader></Loader>}>
        <AvatarEditor
          config={avatarConfig}
          onUpdate={(avatar) => props.onChange?.({ ...props.player, avatar })}
        />
      </Suspense>
      <InputWithLabel
        label={t("nameField")}
        name="name"
        onChange={(name) => props.onChange?.({ ...props.player, name })}
        value={props.player.name}
        className="mb-3"
        required
      />
      {props.allowChangeAction && (
        <PlayerActionInput
          value={props.player.action}
          onChange={(action) => props.onChange?.({ ...props.player, action })}
        />
      )}
    </div>
  );
}
