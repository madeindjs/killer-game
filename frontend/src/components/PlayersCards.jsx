import { PlayerCard } from "./PlayerCard";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {import('@killer-game/types').GameActionRecord[]} actions
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 */

/**
 * @param {Props} param0
 */
export default function PlayersCards({ players, actions, onPlayerUpdate, onPlayerDelete }) {
  function findAction(actionId) {
    return actions?.find((a) => a.id === actionId);
  }

  return (
    <div className="flex flex-wrap gap-4">
      {players.map((player, index) => (
        <div key={player.id}>
          <PlayerCard
            player={player}
            onUpdate={onPlayerUpdate}
            onDelete={() => onPlayerDelete?.(player)}
            editable={true}
          />
        </div>
      ))}
    </div>
  );
}
