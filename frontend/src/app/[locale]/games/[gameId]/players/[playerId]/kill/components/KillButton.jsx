"use client";

import AlertError from "@/components/molecules/AlertError";
import WellDoneGif from "@/components/organisms/WellDoneGif";
import { client } from "@/lib/client";
import { useState } from "react";

/**
 * @typedef Props
 * @property {import("@killer-game/types").PlayerRecordSanitized} player
 * @property {string} killToken
 *
 * @param {Props} props
 */
export default function KillButton(props) {
  const [killError, setKillError] = useState();
  const [killSuccess, setKillSuccess] = useState();

  function onConfirm() {
    if (!player) return undefined;

    client
      .killPlayer(props.player.id, props.killToken)
      .then(() => setKillSuccess())
      .catch((error) => setKillError(error))
      .finally(() => setKillLoading(false));
  }

  if (killSuccess) return <WellDoneGif />;

  if (killError) return <AlertError>{t("PlayerKillPage.badRequest")}</AlertError>;

  return (
    <button className="btn btn-primary" onClick={onConfirm} disabled={killLoading} aria-busy={killLoading}>
      {t("PlayerKillPage.confirm")}
    </button>
  );
}
