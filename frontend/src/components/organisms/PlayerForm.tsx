import { getPlayerAvatarConfig } from "@/utils/avatar";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import Loader from "../atoms/Loader";
import AvatarEditor from "./AvatarEditor";
import PlayerActionInput from "./PlayerActionInput";
import type { PlayerRecord } from "@killer-game/types";

interface Props {
  player: PlayerRecord;
  onChange: (player: PlayerRecord) => void;
  allowChangeAction?: boolean;
}

export default function PlayerForm(props: Props) {
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
