/**
 * @param {{players: any[]}} param0
 */
export default function PlayersTable({ players }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <th>{player.id}</th>
              <td>{player.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
