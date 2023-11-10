"use client";
import GameDashboard from "@/components/pages/GameDashboard";
import useTranslation from "next-translate/useTranslation";

export default function GameDashboardPage({ params: { id: gameId }, searchParams: { password: gamePrivateToken } }) {
  const { t } = useTranslation("common");

  return (
    <main>
      {gamePrivateToken && <p className="text-warning">{t("dontShareUrl")}</p>}
      <GameDashboard gameId={gameId} gamePrivateToken={gamePrivateToken} />
    </main>
  );
}
