import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
  withNextIntl(nextConfig)
);
