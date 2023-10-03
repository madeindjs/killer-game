import { fetchGameByPrivateToken } from "../../../../services/games";

/**
 * Fetch a game
 * @type {import('astro').APIRoute}
 */
export const GET = async ({ redirect, request, params }) => {
  const res = await fetchGameByPrivateToken(params["uuid"]);

  return redirect(`/games/${res.uuid}`);
};
