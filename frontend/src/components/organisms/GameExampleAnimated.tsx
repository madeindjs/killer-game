"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import type { PlayerRecord } from "@killer-game/types";
import { useEffect, useState } from "react";
import { GameTimeline } from "./GameTimeline";
import HeroWithCard from "../atoms/HeroWithCard";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";

export function GameExampleAnimated() {
  const t = useTranslations("homepage.HowDoesItWork");
  const actionsNames = useDefaultActions();

  function makePlayer(id: number, name: string): PlayerRecord {
    return {
      game_id: "",
      id: String(id),
      name,
      action: actionsNames[id]!,
      kill_token: 1,
      killed_at: null,
      killed_by: null,
      order: id,
      private_token: "",
    };
  }

  const player1 = makePlayer(1, "Bob");
  const player2 = makePlayer(2, "Alice");
  const player3 = makePlayer(3, "Luc");
  const player4 = makePlayer(4, "Jean");

  function markPlayerDead(p: PlayerRecord): PlayerRecord {
    return { ...p, killed_at: "2025" };
  }

  const steps: PlayerRecord[][] = [
    [player1, player2, player3, player4],
    [player1, markPlayerDead(player2), player3, player4],
    [player1, markPlayerDead(player2), player3, markPlayerDead(player4)],
    [player1, markPlayerDead(player2), markPlayerDead(player3), markPlayerDead(player4)],
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2_000);

    return () => clearInterval(int);
  }, [steps.length]);

  return (
    <HeroWithCard
      className="my-8"
      side={<GameTimeline players={steps[activeStep]} />}
      card={
        <div className="flex flex-col gap-4">
          <h3 className={STYLES.h3}>{t("title")}</h3>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={activeStep}
            className="range range-primary"
            step="1"
            readOnly
          />
          <p className="text-sm opacity-80">
            {t("descriptions.2")}
          </p>
        </div>
      }
    />
  );
}
