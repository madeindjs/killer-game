const nextTranslate = require("next-translate-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ["fr", "en"],
  //   defaultLocale: "en",
  // },
  output: "standalone",
};

module.exports = nextTranslate(nextConfig);

// module.exports = nextConfig;
