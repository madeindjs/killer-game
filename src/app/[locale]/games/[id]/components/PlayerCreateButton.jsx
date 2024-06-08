import { useDefaultActions } from "@/hooks/use-default-actions.server";
import { clientServer } from "@/lib/client";
import { getGameUrl } from "@/lib/routes";
import { getRandomItemInArray } from "@/utils/array";
import { getLocale, getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

/**
 * @import {GameRecord} from '@/models'
 *
 * @typedef Props
 * @property {GameRecord} game
 *
 * @param {Props} props
 */
export default async function PlayerCreateButton(props) {
  const t = await getTranslations("games");
  const lang = await getLocale();

  // TODO form status

  async function onSubmit() {
    "use server";
    const messages = useDefaultActions();
    await clientServer.createPlayer(props.game.id, props.game.password, {
      name: `New player`,
      action: getRandomItemInArray(messages),
    });
    const url = getGameUrl({ slug: props.game.slug, password: props.game.password }, lang);
    console.log(`revalidate ${url}`);
    revalidatePath(url);
    // revalidatePath("/[locale]/games/[id]", "page");
  }

  return (
    <form action={onSubmit}>
      <input className="btn btn-primary" type="submit" value="Add a player" />
    </form>
  );
}
