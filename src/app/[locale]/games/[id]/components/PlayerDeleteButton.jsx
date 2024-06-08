import { clientServer } from "@/lib/client";
import { getGameUrl } from "@/lib/routes";
import { getLocale, getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { useActionState } from "react";

/**
 * @import {GameRecord, PlayerRecord} from '@/models'
 *
 * @typedef Props
 * @property {GameRecord} game
 * @property {PlayerRecord} player
 *
 * @param {Props} props
 */
export default async function PlayerDeleteButton(props) {
  const t = await getTranslations("games");
  const lang = await getLocale();

  // TODO form status

  async function onSubmit() {
    "use server";
    await clientServer.deletePlayer(props.game.id, props.game.password, props.player.id);
    const url = getGameUrl(props.game, lang);
    console.log(`revalidate ${url}`);
    revalidatePath(url);
    // revalidatePath("/[locale]/games/[id]", "page");
  }

  useActionState();

  return (
    <form action={onSubmit}>
      <input className="btn btn-primary" type="submit" value="Remove player" />
    </form>
  );
}
