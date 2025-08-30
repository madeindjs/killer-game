"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import type { PlayerRecord } from "@killer-game/types";
import { useState } from "react";
import classNames from "classnames";
import { GameTimeline } from "./GameTimeline";

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
  const player1: PlayerRecord = {
    ...playerBase,
    name: "Bob",
    id: "1",
    order: 1,
    action: actionsNames[0]!,
  };
  const player2: PlayerRecord = {
    ...playerBase,
    name: "Alice",
    id: "2",
    order: 2,
    action: actionsNames[1]!,
  };
  const player3: PlayerRecord = {
    ...playerBase,
    name: "Luc",
    id: "3",
    order: 3,
    action: actionsNames[2]!,
  };
  const player4: PlayerRecord = {
    ...playerBase,
    name: "Fred",
    id: "4",
    order: 4,
    action: actionsNames[3]!,
  };

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

  return (
    <div>
      <GameTimeline players={steps[activeStep]} />
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
