import { PropsWithChildren } from "hono/jsx";
import { LangContext } from "../context/LangContext";
import Footer from "../organisms/Footer";
import NavBar from "../organisms/NavBar";

export default function RootLayout({ children, lang }: PropsWithChildren<{ lang: string }>) {
  return (
    <LangContext.Provider value={lang}>
      <html lang={lang}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="stylesheet" href="/static/styles.css" />
          <link rel="mask-icon" href="/favicon.svg" color="#000000"></link>
        </head>
        <body>
          <main className="flex flex-col" style={{ minHeight: "100vh" }}>
            <NavBar />
            <div className="container mx-auto flex-1 pb-5">{children}</div>
            <Footer />
          </main>
        </body>
      </html>
    </LangContext.Provider>
  );
}
