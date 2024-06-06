"use client";

import { useDefaultActions } from "@/hooks/use-default-actions";
import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";

/**
 * @import {PlayerRecord} from '@/models'
 */

/**
 *
 *
 *
 * @typedef Props
 * @property {string} gameId
 * @property {string} password
 * @property {PlayerRecord[]} players
 *
 *
 * @param {Props} props
 * @returns
 */
export default function GameEditor(props) {
  const [players, setPlayers] = useState(props.players);

  const messages = useDefaultActions();

  async function createdPlayer() {
    const player = await client.createPlayer(props.gameId, props.password, {
      name: `Player #${players.length + 1}`,
      action: getRandomItemInArray(messages),
    });
    setPlayers([...players, player]);
  }

  async function updatePlayer(player) {
    await client.updatePlayer(props.gameId, props.password, player);

    const index = players.findIndex((p) => p.id === player.id);

    const playersCopy = [...players];
    playersCopy[index] = player;

    setPlayers(playersCopy);
  }

  async function deletePlayer(playerId) {
    setPlayers(await client.deletePlayer(props.gameId, props.password, playerId));
  }

  const firstPlayer = players[0];

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
            <PlayerAction key={"action" + player.id} player={player} onUpdate={updatePlayer} />
          </>
        ))}

        {firstPlayer && (
          <Player player={firstPlayer} onDelete={() => deletePlayer(firstPlayer.id)} onUpdate={updatePlayer} />
        )}

        <div className="col-start-2">
          <button className="btn btn-primary" onClick={createdPlayer}>
            Add a player
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * @template T
 * @param {T[]} items
 * @returns {T | undefined}
 */
function getRandomItemInArray(items) {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

function TriangleBottom() {
  return (
    <div
      class="w-0 h-0
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
    <div className="flex flex-col gap-3">
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
    </div>
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
      <div>
        <input
          type="text"
          className="input input-bordered  max-w-xs"
          value={action}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <TriangleBottom />
    </div>
  );
}
