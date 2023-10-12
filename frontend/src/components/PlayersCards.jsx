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
    <div className="carousel rounded-box">
      <div className="carousel-item">
        <img src="/images/stock/photo-1559703248-dcaaec9fab78.jpg" alt="Burger" />
      </div>
      <div className="carousel-item">
        <img src="/images/stock/photo-1565098772267-60af42b81ef2.jpg" alt="Burger" />
      </div>
      <div className="carousel-item">
        <img src="/images/stock/photo-1572635148818-ef6fd45eb394.jpg" alt="Burger" />
      </div>
      <div className="carousel-item">
        <img src="/images/stock/photo-1494253109108-2e30c049369b.jpg" alt="Burger" />
      </div>
      <div className="carousel-item">
        <img src="/images/stock/photo-1550258987-190a2d41a8ba.jpg" alt="Burger" />
      </div>
      <div className="carousel-item">
        <img src="/images/stock/photo-1559181567-c3190ca9959b.jpg" alt="Burger" />
      </div>
      <div className="carousel-item">
        <img src="/images/stock/photo-1601004890684-d8cbf643f5f2.jpg" alt="Burger" />
      </div>
    </div>
  );

  return (
    <ul className="steps steps-vertical">
      {players.map((player) => (
        <li key={player.id} className="step">
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
