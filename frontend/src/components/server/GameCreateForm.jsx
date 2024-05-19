import GameForm from "@/components/server/GameForm";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { clientServer } from "@/lib/client";
import { getGameUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import { redirect } from "next/navigation";

/**
 * @import {GameRecord} from '@/models'
 * @returns
 */
export default function GameCreateForm() {
  const { t, lang } = useTranslation("common");

  const actions = useDefaultActions();

  /** @type {GameRecord} */
  const initialGame = { name: "", actions: actions.map((a) => ({ name: a })) };

  /**
   * @param {FormData} formData
   */
  async function handleSubmit(formData) {
    "use server";
    const newGame = await clientServer.createGame({
      name: formData.get("name"),
      actions: formData.get("actions").split("\n"),
    });

    redirect(getGameUrl(newGame, lang));
  }

  return (
    <form action={handleSubmit}>
      <GameForm game={initialGame} />;
    </form>
  );
}
