import { PlayerCard } from "./PlayerCard";

/**
 * @param {{players: import('@killer-game/types').PlayerRecord[], actions: GameActionRecord[]}} param0
 */
export default function PlayersCards({ players, actions }) {
  // return (
  //   <ul className="steps steps-vertical">
  //     {players.map((player) => (
  //       <li className="step" key={player.id}>
  //         {player.name}
  //       </li>
  //     ))}
  //   </ul>
  // );

  function findAction(actionId) {
    return actions.find((a) => a.id === actionId);
  }

  return (
    <div className="w-96">
      {players.map((player) => (
        <div key={player.id}>
          <PlayerCard player={player} />
          <div className="divider">{findAction(player.action_id)?.name}</div>
        </div>
      ))}
    </div>
  );
}
