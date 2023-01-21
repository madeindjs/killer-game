import { Head, Html, Main, NextScript } from "next/document";
import Navbar from "../components/navbar";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <main className="container">
          <Navbar />
          <Main />
        </main>
        <NextScript />
      </body>
    </Html>
  );
}
