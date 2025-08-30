"use client";
import { isPlayerDead } from "@/utils/player";
import type { PlayerRecord } from "@killer-game/types";
import { Fragment, ReactNode } from "react";
import PlayerAvatar from "../molecules/PlayerAvatar";
import classNames from "classnames";

function GameTimelineAction(props: {
  action: string;
  done?: boolean;
  editable?: boolean;
}) {
  return (
    <li>
      <hr className="bg-primary" />
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -5 20 20"
          fill="currentColor"
          className="text-primary h-5 w-5"
        >
          <polygon points="0,0 20,0 10,10" />
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

function GameTimelinePlayer(props: {
  player: PlayerRecord;
  isFirst?: boolean;
  isLast?: boolean;
  onAvatarClick?: () => void;
}) {
  const isDead = isPlayerDead(props.player);
  return (
    <li>
      {!props.isFirst && <hr className="bg-primary" />}
      <div
        className={classNames({
          "timeline-start": true,
          "timeline-box": true,
          "mr-3": isDead,
        })}
      >
        {props.player.name}
      </div>
      <div className="timeline-middle">
        <PlayerAvatar
          player={props.player}
          killed={isPlayerDead(props.player)}
          size={isDead ? "xs" : "s"}
          onClick={() => props.onAvatarClick?.()}
        />
      </div>
      {isDead && (
        <div
          className={classNames({
            "timeline-end py-3": true,
            "line-through": isDead,
          })}
        >
          {props.player.action}
        </div>
      )}
      {!props.isLast && <hr className="bg-primary" />}
    </li>
  );
}

export function GameTimeline(props: {
  players: PlayerRecord[];
  editable?: boolean;
  onAvatarClick?: (player: PlayerRecord) => void;
  onPlayerUpdate?: (player: PlayerRecord) => void;
}) {
  const players = props.players.toSorted((a, b) => a.order - b.order);
  if (players.length === 0) return <></>;

  const rows = players
    .concat(players.at(0))
    .reduce<ReactNode[]>((rows, player, i, players) => {
      const playerEl = (
        <GameTimelinePlayer
          key={player.id}
          player={player}
          onAvatarClick={() => props.onAvatarClick?.(player)}
          isFirst={i === 0}
        />
      );

      if (i === 0) {
        rows.push(playerEl);
      } else if (isPlayerDead(player)) {
        rows.push(playerEl);
      } else {
        rows.push(
          <Fragment key={player.id}>
            <GameTimelineAction
              action={player.action}
              editable={props.editable}
            />
            {playerEl}
          </Fragment>,
        );
      }

      return rows;
    }, []);

  return <ul className="timeline timeline-vertical">{rows}</ul>;
}
