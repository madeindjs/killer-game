export const getGameNotFoundResponse = () => Response.json({ error: "game not found" }, { status: 404 });

export const getPlayerNotFoundResponse = () => Response.json({ error: "player not found" }, { status: 404 });

export const getInvalidTokenResponse = () =>
  Response.json({ error: "Authorization token is not valid" }, { status: 403 });
