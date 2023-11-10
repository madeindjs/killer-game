import GameDashboard from "@/components/pages/GameDashboard";
import { useMessages, useTranslations } from "next-intl";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Game dashboard",
  // description: "Manage your game",
};

export default function GameDashboardPage({ params: { id: gameId }, searchParams: { password: gamePrivateToken } }) {
  const t = useTranslations();

  const messages = useMessages();

  /** @type {import("@/components/pages/GameDashboard").GameDashboardI18n} */
  const i18n = {
    AvatarEditor: {
      bgColor: t("AvatarEditor.bgColor"),
      earSize: t("AvatarEditor.earSize"),
      faceColor: t("AvatarEditor.faceColor"),
      glassesStyle: t("AvatarEditor.glassesStyle"),
      hairColor: t("AvatarEditor.hairColor"),
      hairStyle: t("AvatarEditor.hairStyle"),
      hatStyle: t("AvatarEditor.hatStyle"),
      mouthStyle: t("AvatarEditor.mouthStyle"),
      noseStyle: t("AvatarEditor.noseStyle"),
      shirtStyle: t("AvatarEditor.shirtStyle"),
      title: t("AvatarEditor.title"),
    },
    AvatarEditor: messages["AvatarEditor"],
    GameDashboardInvite: messages["GameDashboardInvite"],
    events: t("GameDashboard.events"),
    GameStartButton: {
      start: t("Game.startAction"),
      stop: t("Game.stoptAction"),
      title: t("Game.startField"),
    },
    gameUrlNotValid: t("gameUrlNotValid"),
    podium: t("GameDashboard.podium"),
    timeline: t("GameDashboard.timeline"),
    GamePodium: messages["GamePodium"],
    PlayerStatusBadge: messages["PlayerStatusBadge"],
  };

  return (
    <main>
      {gamePrivateToken && <p className="text-warning">{t("dontShareUrl")}</p>}
      <GameDashboard gameId={gameId} gamePrivateToken={gamePrivateToken} i18n={i18n} />
    </main>
  );
}
