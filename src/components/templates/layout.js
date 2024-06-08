import Head from "next/head";

import NavBar from "@/components/organisms//NavBar";
import Footer from "@/components/organisms/Footer";

export default function RootLayout({ children, lang }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000"></link>
      </Head>
      <main className="flex flex-col" style={{ minHeight: "100vh" }}>
        <NavBar />
        <div className="container mx-auto flex-1 pb-5">{children}</div>
        <Footer />
      </main>
    </>
  );
}
