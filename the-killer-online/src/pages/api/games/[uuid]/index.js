import { fetchGame } from "../../../../services/games";

/**
 * Fetch a game
 * @type {import('astro').APIRoute}
 */
export const GET = async ({ redirect, request, params }) => {
  const res = await fetchGame(params["uuid"]);

  return redirect(`/games/${res.uuid}`);
};
