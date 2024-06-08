"use client";

import Card from "@/components/atoms/Card";
import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";

/**
 * @import {PlayerRecord, GameRecord} from '@/models'
 */

/**
 * @typedef Props
 * @property {GameRecord} game
 * @property {string} password
 * @property {PlayerRecord[]} players
 *
 *
 * @param {Props} props
 */
export default function GameEditor(props) {
  const [players, setPlayers] = useState(props.players);

  async function updatePlayer(player) {
    await client.updatePlayer(props.game.id, props.game.password, player);

    const index = players.findIndex((p) => p.id === player.id);

    const playersCopy = [...players];
    playersCopy[index] = player;

    setPlayers(playersCopy);
  }

  async function deletePlayer(playerId) {
    setPlayers(await client.deletePlayer(props.game.id, props.game.password, playerId));
  }

  const firstPlayer = players[0];

  console.log(players);

  return (
    <>
      <div className="flex flex-col gap-3">
        {players.map((player) => (
          <>
            <Player
              key={"player" + player.id}
              player={player}
              onDelete={() => deletePlayer(player.id)}
              onUpdate={updatePlayer}
            />
            <PlayerAction key={"action_" + player.id} player={player} onUpdate={updatePlayer} />
          </>
        ))}

        {firstPlayer && (
          <Player player={firstPlayer} onDelete={() => deletePlayer(firstPlayer.id)} onUpdate={updatePlayer} />
        )}
      </div>
    </>
  );
}

function TriangleBottom() {
  return (
    <div
      className="w-0 h-0
        border-l-[5px] border-l-transparent
        border-t-[8px] border-t-base-content
        border-r-[5px] border-r-transparent"
    ></div>
  );
}

/**
 * @typedef PlayerProps
 * @property {PlayerRecord} player
 * @property {() => void} onDelete
 * @property {() => void} onUpdate
 *
 * @param {PlayerProps} props
 */
function Player(props) {
  const [name, setName] = useState(props.player.name);

  useEffect(() => setName(props.player.name), [props.player]);

  function onNameChange(newName) {
    setName(newName);
    props.onUpdate({ ...props.player, name: newName });
  }

  return (
    <Card>
      <div className="flex gap-4 items-center">
        <Avatar />
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="input input-bordered  max-w-xs"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <div>
            <button className="btn btn-xs" onClick={props.onDelete}>
              delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * @typedef PlayerProps
 * @property {PlayerRecord} player
 * @property {() => void} onDelete
 * @property {() => void} onUpdate
 *
 * @param {PlayerProps} props
 */
function PlayerAction(props) {
  const [action, setAction] = useState(props.player.action);

  function onNameChange(newAction) {
    setAction(newAction);
    props.onUpdate({ ...props.player, action: newAction });
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        type="text"
        className="input input-bordered"
        value={action}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TriangleBottom />
    </div>
  );
}
