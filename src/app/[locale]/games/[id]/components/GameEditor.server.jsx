import Card from "@/components/atoms/Card";
import { client } from "@/lib/client";
import Avatar from "./Avatar";
import PlayerDeleteButton from "./PlayerDeleteButton";

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

  const firstPlayer = props.players[0];

  return (
    <>
      <div className="flex flex-col gap-3">
        {props.players.map((player) => (
          <>
            <Player key={"player" + player.id} player={player} game={props.game} />
            <PlayerAction key={"action_" + player.id} player={player} onUpdate={updatePlayer} />
          </>
        ))}

        {firstPlayer && <Player player={firstPlayer} game={props.game} />}
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
 * @property {GameRecord} game
 * @property {() => void} onDelete
 * @property {() => void} onUpdate
 *
 * @param {PlayerProps} props
 */
function Player(props) {
  return (
    <Card>
      <div className="flex gap-4 items-center">
        <Avatar />
        <div className="flex flex-col gap-2">
          <input type="text" className="input input-bordered  max-w-xs" value={props.player.name} />
          <div>
            <PlayerDeleteButton game={props.game} player={props.player} />
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
  function onNameChange(newAction) {
    setAction(newAction);
    props.onUpdate({ ...props.player, action: newAction });
  }

  return (
    <form className="flex flex-col justify-center items-center">
      <input type="text" className="input input-bordered" value={props.player.action} />
      <TriangleBottom />
    </form>
  );
}
