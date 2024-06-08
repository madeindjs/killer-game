import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Head from "next/head";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import "@/global.css";

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000"></link>
      </Head>
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
