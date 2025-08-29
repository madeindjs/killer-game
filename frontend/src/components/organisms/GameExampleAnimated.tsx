"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import type {
  PlayerRecord,
  PlayerRecordSanitized,
  GamePlayersTable,
} from "@killer-game/types";
import PlayerAvatar from "../molecules/PlayerAvatar";
import { Fragment, useState } from "react";
import classNames from "classnames";

function isPlayerDead(player: PlayerRecord | PlayerRecordSanitized) {
  return "killed_at" in player && !!player.killed_at;
}

function GameTableTimelineAction(props: { action: string; done?: boolean }) {
  return (
    <li>
      <hr className="bg-primary" />
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-primary h-5 w-5"
        >
          <circle cx="10" cy="10" r="5" />
        </svg>
      </div>
      <div
        className={classNames({
          "timeline-end py-3": true,
          "line-throughn": props.done,
        })}
      >
        {props.action}
      </div>
      <hr className="bg-primary" />
    </li>
  );
}

function GameTableTimelinePlayer(props: {
  player: PlayerRecord | PlayerRecordSanitized;
  deadAction?: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <li>
      {!props.isFirst && <hr className="bg-primary" />}
      <div
        className={classNames({
          "timeline-start": true,
          "timeline-box": props.deadAction,
        })}
      >
        {props.player.name}
      </div>
      <div className="timeline-middle">
        <PlayerAvatar
          player={props.player}
          killed={isPlayerDead(props.player)}
          size={props.deadAction ? "xs" : "s"}
        />
      </div>
      <div className={"timeline-end py-3 line-through"}>{props.deadAction}</div>
      {!props.isLast && <hr className="bg-primary" />}
    </li>
  );
}

function GameTableTimeline(props: { gamePlayersTable: GamePlayersTable }) {
  return (
    <ul className="timeline timeline-vertical">
      <GameTableTimelinePlayer
        player={props.gamePlayersTable[0].player}
        isFirst
      />
      {props.gamePlayersTable.map((r, i) => (
        <Fragment key={i}>
          {isPlayerDead(r.target) ? (
            <GameTableTimelinePlayer player={r.target} deadAction={r.action} />
          ) : (
            <Fragment>
              <GameTableTimelineAction action={r.action} />
              <GameTableTimelinePlayer player={r.target} />
            </Fragment>
          )}
        </Fragment>
      ))}
    </ul>
  );
}

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
  const player1: PlayerRecord = { ...playerBase, name: "Bob", id: "1" };
  const player2: PlayerRecord = { ...playerBase, name: "Alice", id: "2" };
  const player3: PlayerRecord = { ...playerBase, name: "Luc", id: "3" };
  const player4: PlayerRecord = { ...playerBase, name: "Fred", id: "4" };

  const player2X = markPlayerDead(player2);
  const player3X = markPlayerDead(player3);
  const player4X = markPlayerDead(player4);

  function markPlayerDead(p: PlayerRecord): PlayerRecord {
    return { ...p, killed_at: "2025" };
  }

  const action1 = actionsNames[0]!;
  const action2 = actionsNames[1]!;
  const action3 = actionsNames[2]!;
  const action4 = actionsNames[3]!;

  const [activeStep, setActiveStep] = useState(0);

  const steps: GamePlayersTable[] = [
    [
      { player: player1, action: action1, target: player2 },
      { player: player2, action: action2, target: player3 },
      { player: player3, action: action3, target: player4 },
      { player: player4, action: action4, target: player1 },
    ],
    [
      { player: player1, action: action1, target: player2X },
      { player: player2X, action: action2, target: player3 },
      { player: player3, action: action3, target: player4 },
      { player: player4, action: action4, target: player1 },
    ],
    [
      { player: player1, action: action1, target: player2X },
      { player: player2X, action: action2, target: player3X },
      { player: player3X, action: action3, target: player4 },
      { player: player4, action: action4, target: player1 },
    ],
  ];

  return (
    <div>
      <GameTableTimeline gamePlayersTable={steps[activeStep]} />
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
