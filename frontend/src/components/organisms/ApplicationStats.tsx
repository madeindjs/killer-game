"use client";

import { useTranslations } from "next-intl";
import { useApplicationStats } from "@/hooks/use-application-stats";

interface StatTileProps {
  icon: string;
  label: string;
  value: string;
}

function StatTile({ icon, label, value }: StatTileProps) {
  return (
    <div className="stat place-items-center bg-base-100 rounded-box shadow border border-base-200">
      <div className="stat-title text-3xl mb-1">{icon}</div>
      <div className="stat-value text-primary">{value}</div>
      <div className="stat-desc text-sm opacity-80">{label}</div>
    </div>
  );
}

export default function ApplicationStats() {
  const t = useTranslations("homepage.Stats");
  const { loading, error, stats } = useApplicationStats();

  if (error) {
    return null;
  }

  const items: StatTileProps[] = [
    {
      icon: "🎮",
      label: t("gamesCreated"),
      value: stats?.counts.games_created?.toLocaleString() || "0",
    },
    {
      icon: "💀",
      label: t("playersEliminated"),
      value: stats?.counts.players_eliminated?.toLocaleString() || "0",
    },
    {
      icon: "🔥",
      label: t("playersEliminatedLast6Months"),
      value:
        stats?.counts.players_eliminated_last_6_months?.toLocaleString() || "0",
    },
    {
      icon: "🚀",
      label: t("gamesStarted"),
      value: stats?.counts.games_started?.toLocaleString() || "0",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? items.map((_, i) => (
            <div
              key={i}
              className="stat place-items-center bg-base-100 rounded-box shadow border border-base-200"
            >
              <div className="stat-title mb-1">{t("loading")}</div>
              <div className="stat-value text-primary animate-pulse">...</div>
            </div>
          ))
        : items.map((item, i) => <StatTile key={i} {...item} />)}
    </div>
  );
}
