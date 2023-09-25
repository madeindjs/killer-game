import { addGameUuidToCookies, createGame } from "../../../services/games";

/**
 * Create a game
 * @type {import('astro').APIRoute}
 */
export const POST = async ({ redirect, request, cookies }) => {
  const formData = await request.formData();

  const game = await createGame({ name: formData.get("name") });

  addGameUuidToCookies(game.uuid, cookies);

  return redirect(`/games/${game.uuid}`);
};
