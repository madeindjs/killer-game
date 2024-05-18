export const GameNotFoundResponse = Response.json({ error: "game not found" }, { status: 404 });

export const PlayerNotFoundResponse = Response.json({ error: "player not found" }, { status: 404 });

export const InvalidTokenResponse = Response.json({ error: "Authorization token is not valid" }, { status: 403 });
