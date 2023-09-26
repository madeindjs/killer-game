import { createPlayer, getPlayerPublicUrl } from "../../../services/player";

/**
 * Create a game
 * @type {import('astro').APIRoute}
 */
export const POST = async ({ redirect, request, cookies }) => {
  const formData = await request.formData();

  const player = await createPlayer({ name: formData.get("name") }, formData.get("game_public_token"));

  return redirect(getPlayerPublicUrl(player));
};
