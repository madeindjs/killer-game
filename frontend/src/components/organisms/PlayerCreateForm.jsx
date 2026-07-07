"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import { getRandomItemInArray } from "@/utils/array";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { genConfig } from "react-nice-avatar";
import PlayerForm from "./PlayerForm";

/**
 * @typedef PlayerCreateFormProps
 * @property {boolean} [busy]
 * @property {string} [defaultName]
 * @property {boolean} [allowChangeAction]
 * @property {(player: import("@killer-game/types").PlayerCreateDTO | import("@killer-game/types").PlayerRecordSanitized, file?: File) => void} [onSubmit]
 *
 * @param {PlayerCreateFormProps} param0
 */
export default function PlayerCreateForm({
  onSubmit,
  busy,
  defaultName = "My new player",
  allowChangeAction,
}) {
  const actions = useDefaultActions();
  const [player, setPlayer] = useState({
    name: defaultName,
    avatar: genConfig(defaultName),
    action: getRandomItemInArray(actions),
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const t = useTranslations("games.PlayerCreateForm");

  useEffect(() => {
    setPlayer({
      name: defaultName,
      avatar: genConfig(defaultName),
      action: getRandomItemInArray(actions),
    });
    setAvatarFile(null);
  }, [setPlayer, defaultName, actions]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(player, avatarFile);
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <PlayerForm
        player={player}
        onChange={setPlayer}
        allowChangeAction={allowChangeAction}
        onFileSelect={setAvatarFile}
        onFileRemove={() => setAvatarFile(null)}
      />
      <input
        type="submit"
        className="btn btn-primary min-h-[2.75rem]"
        disabled={busy}
        value={t("submit")}
      />
    </form>
  );
}
