import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Toast from "../components/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="synthwave">
      <head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="flex flex-col" style={{ minHeight: "100vh" }}>
        <NavBar />
        <div className="container mx-auto flex-1">{children}</div>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}