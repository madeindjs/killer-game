"use client";
import { useLocationOrigin } from "@/hooks/use-domain";
import { getGameJoinUrl } from "@/lib/routes";
import { useLocale, useTranslations } from "next-intl";
import InputCopyToClipBoard from "./InputCopyToClipBoard";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecord} game
 * @param {Props} param0
 */
export default function GameJoinLink({ game }) {
  const t = useTranslations("games");
  const lang = useLocale();

  const origin = useLocationOrigin();
  const url = getGameJoinUrl(game, lang, origin);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{t("GameJoinLink.urlField")}</span>
      </label>
      <InputCopyToClipBoard value={url} />
      {game.started_at && <p className="text-warning mt-2">{t("GameJoinLink.gameStartedWarning")}</p>}
    </div>
  );
}
