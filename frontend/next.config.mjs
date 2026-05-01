import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ["fr", "en"],
  //   defaultLocale: "en",
  // },
  output: "standalone",
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(withNextIntl(nextConfig));

// module.exports = nextConfig;
