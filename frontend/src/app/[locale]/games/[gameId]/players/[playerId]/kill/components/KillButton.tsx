"use client";

import Loader from "@/components/atoms/Loader";
import AlertError from "@/components/molecules/AlertError";
import AlertSuccess from "@/components/molecules/AlertSuccess";
import WellDoneGif from "@/components/organisms/WellDoneGif";
import { client } from "@/lib/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function KillButton(props: {
  playerId: string;
  killToken: string;
}) {
  const t = useTranslations("player-kill.PlayerKillPage");
  const { confirm, error, loading, success } = useKillButton(
    props.playerId,
    props.killToken,
  );

  if (success)
    return (
      <>
        <WellDoneGif />
        <AlertSuccess>{t("wellDone")}</AlertSuccess>
      </>
    );

  if (error) return <AlertError>{t("badRequest")}</AlertError>;

  return (
    <button
      className="btn btn-primary"
      onClick={confirm}
      disabled={loading}
      aria-busy={loading}
    >
      {t("confirm")}
      {loading && <Loader />}
    </button>
  );
}

function useKillButton(playerId: string, killToken: string) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function confirm() {
    setLoading(true);

    client
      .killPlayer(playerId, killToken)
      .then(() => setSuccess(true))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  return { error, success, loading, confirm };
}
