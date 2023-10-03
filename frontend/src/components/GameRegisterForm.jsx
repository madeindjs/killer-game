export default function GameRegisterForm() {
  return (
    <form action="/api/games/join" method="post">
      <input type="hidden" name="game_public_token" value={game.public_token} />
      <label for="">Your name</label>
      <input className="input input-bordered input-primary w-full max-w-xs" type="text" name="name" required />
      <input type="submit" className="btn btn-primary" />
    </form>
  );
}
