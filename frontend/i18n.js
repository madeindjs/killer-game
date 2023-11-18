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
    "/games/[id]": ["common", "games", "toast", "game-dashboard"],
    "/games/[id]/join": ["common", "games", "toast", "game-join"],
    "/players/[id]": ["common", "player-dashboard", "toast"],
  },
};
