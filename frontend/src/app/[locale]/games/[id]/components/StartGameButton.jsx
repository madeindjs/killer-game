import { clientServer } from "@/lib/client";
import { getTranslations } from "next-intl/server";

/**
 * @import {GameRecord} from '@/models'
 *
 * @typedef Props
 * @property {GameRecord} game
 *
 * @param {Props} props
 */
export default async function StartGameButton(props) {
  const t = await getTranslations("games");
  // TODO form status

  async function onSubmit() {
    "use server";
    await clientServer.updateGame({ ...props.game, startedAt: new Date() });
  }

  return (
    <form action={onSubmit}>
      <input className="btn btn-primary" type="submit" value={t("GameStartButton.start")} />
    </form>
  );
}
