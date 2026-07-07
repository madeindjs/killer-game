import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import "@/global.css";

import { routing } from "@/i18n/routing";
import { ReactNode } from 'react';
import type { Metadata } from "next";
import { OPEN_GRAPH_DEFAULTS, SITE_NAME, SITE_URL, TWITTER_DEFAULTS } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — organize a Killer party game online`,
    template: `%s — ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    title: `${SITE_NAME} — organize a Killer party game online`,
    description:
      "Create or join a Killer party game: assign elimination missions, track the last player standing, and turn your event into a memorable social game.",
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: `${SITE_NAME} — organize a Killer party game online`,
    description:
      "Create or join a Killer party game: assign elimination missions, track the last player standing, and turn your event into a memorable social game.",
  },
  alternates: {
    canonical: new URL(`${SITE_URL}/${routing.defaultLocale}`),
    languages: {
      en: `${SITE_URL}/en`,
      fr: `${SITE_URL}/fr`,
      "x-default": `${SITE_URL}/${routing.defaultLocale}`,
    },
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon/android-chrome-512x512.png`,
  description:
    "Web app for organizing Killer party games: create games, invite players, assign elimination tasks, and track the last player standing.",
};

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000"></link>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Killer" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Killer" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_LD),
          }}
        />
      </head>
      <body>
        <main className="flex flex-col" style={{ minHeight: "100vh" }}>
          <NavBar />
          <div className="container mx-auto flex-1 pb-5">
            <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
