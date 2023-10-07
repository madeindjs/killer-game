import { PlayerCard } from "./PlayerCard";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {import('@killer-game/types').GameActionRecord[]} actions
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 */

/**
 * @param {Props} param0
 */
export default function PlayersCards({ players, actions, onPlayerUpdate }) {
  function findAction(actionId) {
    return actions.find((a) => a.id === actionId);
  }

  return (
    <div className="w-96">
      {players.map((player) => (
        <div key={`${player.id}_${player.updated_at}`}>
          <PlayerCard player={player} onUpdate={onPlayerUpdate} editable={true} />
          <div className="divider">{findAction(player.action_id)?.name}</div>
        </div>
      ))}
    </div>
  );
}
