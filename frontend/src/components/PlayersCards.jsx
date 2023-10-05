import { PlayerCard } from "./PlayerCard";

/**
 * @param {{players: PlayerRecord[], actions: GameActionRecord[]}} param0
 */
export default function PlayersCards({ players, actions }) {
  // return (
  //   <ul class="steps steps-vertical">
  //     {players.map((player) => (
  //       <li class="step" key={player.id}>
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
          <div class="divider">{findAction(player.action_id)?.name}</div>
        </div>
      ))}
    </div>
  );
}
