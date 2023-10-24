import PlayerAvatar from "./PlayerAvatar";

/**
 * @typedef PlayersTableCellPlayerProps
 * @property {import('@killer-game/types').PlayerRecord} player
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableCellPlayer({ player }) {
  return (
    <div className="flex items-center space-x-3">
      <PlayerAvatar player={player} size="s" />
      <div>
        <p className="font-bold">{player.name}</p>
        <p className="text-sm opacity-50">Edit</p>
      </div>
    </div>
  );
}

/**
 * @typedef PlayersTableRowProps
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {import('@killer-game/types').PlayerRecord} target
 * @property {import('@killer-game/types').GameActionRecord} action
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 *
 * @param {PlayersTableRowProps} param0
 * @returns
 */
function PlayersTableRow({ player, target, action }) {
  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <PlayersTableCellPlayer player={player} />
      </td>
      <td>
        {action.name}
        <br />
        <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
      </td>
      <td>
        <PlayersTableCellPlayer player={target} />
      </td>
      <th>
        <button className="btn btn-ghost btn-xs">details</button>
      </th>
    </tr>
  );
}

/**
 * @typedef PlayersTableProps
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {import('@killer-game/types').GameActionRecord[]} actions
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerUpdate]
 * @property {(player: import('@killer-game/types').PlayerRecord) => void} [onPlayerDelete]
 *
 * @param {PlayersTableProps} param0
 */
export default function PlayersTable({ players, actions, onPlayerUpdate, onPlayerDelete }) {
  /**
   * @param {import('@killer-game/types').PlayerRecord} player
   */
  function findAction(player) {
    return actions.find((a) => a.id === player.action_id);
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Player</th>
            <th>Action</th>
            <th>Target</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayersTableRow player={player} target={player} action={findAction(player)} />
          ))}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
