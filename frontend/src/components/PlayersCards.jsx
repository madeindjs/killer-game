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
    return actions.find((a) => a.id === actionId);
  }

  return (
    <ul class="steps steps-vertical">
      {players.map((player) => (
        <li key={`${player.id}_${player.updated_at}`} className="step">
          <div>
            <PlayerCard
              player={player}
              onUpdate={onPlayerUpdate}
              onDelete={() => onPlayerDelete?.(player)}
              editable={true}
            />
            <p className="my-3 text-xl">{findAction(player.action_id)?.name}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
