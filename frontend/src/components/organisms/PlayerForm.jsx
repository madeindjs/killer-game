import { getPlayerAvatarConfig } from "@/utils/player";
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
 * @param {PlayerFormProps} param0
 */
export default function PlayerForm({ player, onChange, allowChangeAction }) {
  const t = useTranslations("games.PlayerForm");

  const avatarConfig = getPlayerAvatarConfig(player);

  return (
    <div>
      <Suspense fallback={<Loader></Loader>}>
        <AvatarEditor config={avatarConfig} onUpdate={(avatar) => onChange?.({ ...player, avatar })} />
      </Suspense>
      <InputWithLabel
        label={t("nameField")}
        name="name"
        onChange={(name) => onChange?.({ ...player, name })}
        value={player.name}
        className="mb-3"
        required
      />
      {allowChangeAction && (
        <PlayerActionInput value={player.action} onChange={(action) => onChange?.({ ...player, action })} />
      )}
    </div>
  );
}
