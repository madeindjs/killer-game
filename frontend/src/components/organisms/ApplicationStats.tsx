"use client";

import { useTranslations } from "next-intl";
import { useApplicationStats } from "@/hooks/use-application-stats";

export default function ApplicationStats() {
  const t = useTranslations("homepage.Stats");
  const { loading, error, stats } = useApplicationStats();

  if (loading) {
    return (
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat">
            <div className="stat-title">{t("loading")}</div>
            <div className="stat-value animate-pulse">...</div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
      <div className="stat">
        <div className="stat-title">{t("gamesCreated")}</div>
        <div className="stat-value">{stats?.counts.games_created?.toLocaleString() || "0"}</div>
      </div>
      <div className="stat">
        <div className="stat-title">{t("playersEliminated")}</div>
        <div className="stat-value">{stats?.counts.players_eliminated?.toLocaleString() || "0"}</div>
      </div>
      <div className="stat">
        <div className="stat-title">{t("playersEliminatedLast6Months")}</div>
        <div className="stat-value">{stats?.counts.players_eliminated_last_6_months?.toLocaleString() || "0"}</div>
      </div>
      <div className="stat">
        <div className="stat-title">{t("gamesStarted")}</div>
        <div className="stat-value">{stats?.counts.games_started?.toLocaleString() || "0"}</div>
      </div>
    </div>
  );
}
