import { useState } from "react";

/**
 *
 * @param {{name: string, onSubmit: (game: Game) => void}} props
 * @returns
 */
export default function GameForm(props) {
  const [game, setGame] = useState({ name: props.name });

  /**
   * @param {Event} event
   */
  const onSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(game);
  };

  return (
    <form action="POST" onSubmit={onSubmit}>
      <label htmlFor="title">
        Name
        <input
          type="text"
          name="title"
          value={game.name}
          onChange={(event) => {
            console.log(event);
          }}
        />
      </label>
      <input type="submit" />
    </form>
  );
}
