const withNextIntl = require("next-intl/plugin")(
  // This is the default (also the `src` folder is supported out of the box)
  "./src/i18n.js"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ["fr", "en"],
  //   defaultLocale: "en",
  // },
  output: "standalone",
};

module.exports = withNextIntl(nextConfig);

// module.exports = nextConfig;
