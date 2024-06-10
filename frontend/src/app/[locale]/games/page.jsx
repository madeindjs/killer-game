import GamesCreated from "@/components/pages/GamesCreated";
import GamesJoined from "@/components/pages/GamesJoined";
import { getTranslations } from "next-intl/server";

export default function GamesPages() {
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
export async function generateMetadata({ params, searchParams }, parent) {
  const t = await getTranslations("game-created");

  return {
    title: t("title"),
    referrer: "no-referrer",
  };
}
