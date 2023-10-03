export function NavBarGames() {
  return (
    <ul>
      {games.map((game) => (
        <li>
          <a href={getGameAdminUrl(game)}>{game.name}</a>
        </li>
      ))}
    </ul>
  );
}
