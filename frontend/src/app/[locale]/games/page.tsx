import GamesCreated from "@/components/pages/GamesCreated";
import GamesJoined from "@/components/pages/GamesJoined";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export default async function GamesPages({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <GamesCreated />
      <hr className="divider" />
      <GamesJoined />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("games-created");

  return {
    title: t("title"),
    referrer: "no-referrer",
    robots: { index: false, follow: false },
  };
}