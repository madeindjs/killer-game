import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ["fr", "en"],
  //   defaultLocale: "en",
  // },
  output: "standalone",
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

// module.exports = nextConfig;
