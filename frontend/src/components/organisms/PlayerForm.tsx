"use client";
import { getPlayerAvatarConfig } from "@/utils/avatar";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import AvatarEditor from "./AvatarEditor";
import PlayerActionInput from "./PlayerActionInput";
import type { PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";

interface Props {
  player: PlayerRecord | PlayerRecordSanitized;
  onChange: (player: PlayerRecord | PlayerRecordSanitized) => void;
  allowChangeAction?: boolean;
}

export default function PlayerForm(props: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = useTranslations("games.PlayerForm");
  const avatarConfig = getPlayerAvatarConfig(props.player);

  // Extract auth token - prefer player's own token, fall back to any available token
  // PlayerRecord has private_token, PlayerRecordSanitized doesn't
  const authToken = "private_token" in props.player ? props.player.private_token : undefined;
  const hasCustomImage = !!props.player.avatar_image;

  return (
    <div>
      {isClient ? (
        <Suspense
          fallback={
            <div className="flex gap-4">
              <div>
                <div className="avatar placeholder">
                  <div className="skeleton rounded-full w-36 h-36" />
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <div className="skeleton h-4 w-24" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="skeleton h-8 w-20" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <AvatarEditor
            config={avatarConfig}
            onUpdate={(avatar) => props.onChange?.({ ...props.player, avatar, avatar_image: undefined })}
            playerId={props.player.id}
            authToken={authToken}
            hasCustomImage={hasCustomImage}
          />
        </Suspense>
      ) : (
        <div className="flex gap-4">
          <div>
            <div className="avatar placeholder">
              <div className="skeleton rounded-full w-36 h-36" />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <div className="skeleton h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton h-8 w-20" />
              ))}
            </div>
          </div>
        </div>
      )}
      <InputWithLabel
        label={t("nameField")}
        name="name"
        onChange={(name) => props.onChange?.({ ...props.player, name })}
        value={props.player.name}
        className="mb-3"
        required
      />
      {props.allowChangeAction && "action" in props.player && (
        <PlayerActionInput
          value={props.player.action}
          onChange={(action) => props.onChange?.({ ...props.player, action } as PlayerRecord | PlayerRecordSanitized)}
        />
      )}
    </div>
  );
}
