import { destroyGame } from "@/clients/games";

/**
 * @param {{gameId: number, onDestroy?: () => void}} props
 */
export default function GameActions(props) {
  /**
   * @param {Game} game
   */
  const onDestroy = async () => {
    await destroyGame(props.gameId);
    props?.onDestroy();
  };

  return (
    <>
      <button onClick={onDestroy}>Delete the game</button>
    </>
  );
}
