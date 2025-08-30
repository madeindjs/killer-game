"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import type { PlayerRecord } from "@killer-game/types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { GameTimeline } from "./GameTimeline";
import HeroWithCard from "../atoms/HeroWithCard";
import { STYLES } from "@/constants/styles";
import BetaWarning from "../molecules/BeteWarning";

export function GameExampleAnimated() {
  const actionsNames = useDefaultActions();

  const playerBase: PlayerRecord = {
    game_id: "",
    id: "",
    name: "",
    action: "",
    kill_token: 1,
    killed_at: null,
    killed_by: null,
    order: 0,
    private_token: "",
  };

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

  const player2X = markPlayerDead(player2);
  const player3X = markPlayerDead(player3);
  const player4X = markPlayerDead(player4);

  function markPlayerDead(p: PlayerRecord): PlayerRecord {
    return { ...p, killed_at: "2025" };
  }

  const [activeStep, setActiveStep] = useState(0);

  const steps: PlayerRecord[][] = [
    [player1, player2, player3, player4],
    [player1, player2X, player3, player4],
    [player1, player2X, player3, player4X],
    [player1, player2X, player3X, player4X],
  ];

  useEffect(() => {
    const int = setInterval(() => {
      console.log((activeStep + 1) % steps.length);
      setActiveStep((activeStep + 1) % steps.length);
    }, 2_000);

    return () => clearInterval(int);
  });

  return (
    <HeroWithCard
      className="my-20"
      side={<GameTimeline players={steps[activeStep]} />}
      card={
        <>
          <h1 className={STYLES.h1}>Example</h1>
          <div className="w-full max-w-xs">
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={activeStep}
              className="range"
              step="1"
            />
          </div>
          <p className="py-6">Hello</p>
        </>
      }
    />
  );

  return (
    <div>
      <div className="join">
        {steps.map((_, i) => (
          <button
            className={classNames({
              "join-item btn": true,
              "btn-active": activeStep === i,
            })}
            type="button"
            key={i}
            onClick={() => setActiveStep(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
