"use client";
import { getPlayerAvatarConfig } from "@/utils/avatar";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import InputWithLabel from "../atoms/InputWithLabel";
import AvatarEditor from "./AvatarEditor";
import PlayerActionInput from "./PlayerActionInput";
import type { PlayerRecord } from "@killer-game/types";

interface Props {
  player: PlayerRecord;
  onChange: (player: PlayerRecord) => void;
  allowChangeAction?: boolean;
}

export default function PlayerForm(props: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = useTranslations("games.PlayerForm");
  const avatarConfig = getPlayerAvatarConfig(props.player);

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
            onUpdate={(avatar) => props.onChange?.({ ...props.player, avatar })}
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
      {props.allowChangeAction && (
        <PlayerActionInput
          value={props.player.action}
          onChange={(action) => props.onChange?.({ ...props.player, action })}
        />
      )}
    </div>
  );
}
