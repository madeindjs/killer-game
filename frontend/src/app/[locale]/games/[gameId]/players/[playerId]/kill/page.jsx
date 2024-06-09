import HeroWithCard from "@/components/atoms/HeroWithCard";
import AlertError from "@/components/molecules/AlertError";
import Fetching from "@/components/molecules/Fetching";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import WellDoneGif from "@/components/organisms/WellDoneGif";
import RootLayout from "@/components/templates/layout";
import { STYLES } from "@/constants/styles";
import { usePlayer } from "@/hooks/use-player";
import { client } from "@/lib/client";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PlayerKillPage() {
  const t = useTranslations("player-kill");
  const router = useRouter();

  const playerId = router.query.playerId;
  const killToken = router.query.password;

  const { player, loading, error } = usePlayer(playerId);

  const [killLoading, setKillLoading] = useState(false);
  const [killError, setKillError] = useState();
  const [killSuccess, setKillSuccess] = useState();

  function onConfirm() {
    if (!player) return undefined;

    client
      .killPlayer(player.id, killToken)
      .then(() => setKillSuccess())
      .catch((error) => setKillError(error))
      .finally(() => setKillLoading(false));
  }

  function KillButton() {
    if (killSuccess) return <WellDoneGif />;

    if (killError) return <AlertError>{t("PlayerKillPage.badRequest")}</AlertError>;

    return (
      <button className="btn btn-primary" onClick={onConfirm} disabled={killLoading} aria-busy={killLoading}>
        {t("PlayerKillPage.confirm")}
      </button>
    );
  }

  return (
    <RootLayout>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
        <title>{t("title")}</title>
      </Head>

      <HeroWithCard
        card={
          <Fetching loading={loading} error={error} loader={<>{playerId}</>}>
            {player && (
              <div className="flex gap-4 mb-3 items-center">
                <PlayerAvatar player={player} />
                <div className="flex flex-col gap-3">
                  <p className={STYLES.h2}>{player.name}</p>
                </div>
              </div>
            )}
            <KillButton />
          </Fetching>
        }
        side={
          <>
            <h1 className={STYLES.h1}>
              {t("PlayerKillPage.youAreKilling")}
              <strong className="text-primary">{player?.name ?? playerId}</strong>
            </h1>
            <p>{t("PlayerKillPage.headline")}</p>
          </>
        }
      />
    </RootLayout>
  );
}
