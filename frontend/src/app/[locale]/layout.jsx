import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import "@/global.css";

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="mask-icon" href="/favicon/favicon.svg" color="#000000"></link>

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
