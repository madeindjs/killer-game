module.exports = {
  locales: ["en", "fr"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["common", "homepage"],
    "/about": ["common", "about"],
    "/help": ["common", "faq-for-player", "help", "game-example"],
    "/games": ["common", "games-created"],
    "/games/[id]": ["common", "games", "toast", "game-dashboard"],
    "/games/[id]/join": ["common", "games", "toast"],
    "/players/[id]": ["common", "player-dashboard", "toast"],
  },
};
