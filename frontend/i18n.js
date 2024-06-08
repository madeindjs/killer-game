module.exports = {
  locales: ["en", "fr"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["common", "homepage", "actions"],
    "/about": ["common", "about"],
    "/help": ["common", "faq-for-player", "help", "actions"],
    "/games": ["common", "games-created", "actions"],
    "/actions": ["common", "actions", "homepage"],
    "/games/[gameId]": ["common", "games", "toast", "game-dashboard"],
    "/games/[gameId]/join": ["common", "games", "toast", "game-join"],
    "/games/[gameId]/players/[playerId]": ["common", "player-dashboard", "toast"],
    "/games/[gameId]/players/[playerId]/kill": ["player-kill"],
  },
};
