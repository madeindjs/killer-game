import GamesCreated from "@/components/pages/GamesCreated";
import GamesJoined from "@/components/pages/GamesJoined";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function GamesPages({
  params,
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

/**
 * @param {any} param0
 * @param {import("next").ResolvingMetadata} parent
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  const t = await getTranslations("games-created");

  return {
    title: t("title"),
    referrer: "no-referrer",
  };
}
