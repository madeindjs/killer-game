import Head from "next/head";
import "../../globals.css";
import Footer from "../organisms/Footer";
import NavBar from "../organisms/NavBar";

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <main className="flex flex-col" style={{ minHeight: "100vh" }}>
        <NavBar />
        <div className="container mx-auto flex-1 pb-5">{children}</div>
        <Footer />
      </main>
    </>
  );
}
