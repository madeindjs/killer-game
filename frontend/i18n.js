module.exports = {
  locales: ["en", "fr"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["common", "homepage"],
    "/about": ["common", "about"],
    "/help": ["common", "faq-for-player", "help", "game-example"],
    "/games/[id]": ["common", "games"],
    "/games/[id]/join": ["common", "games"],
    "/players/[id]": ["common", "player-dashboard"],
  },
};
