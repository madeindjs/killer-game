import { clientServer } from "@/lib/client";
import { useTranslations as useTranslation } from "next-intl";
import { revalidatePath } from "next/cache";
import {} from "next/navigation";
import PlayerForm from "./PlayerForm";

/**
 * @typedef PlayerCreateFormProps
 * @property {boolean} busy
 * @property {string} defaultName
 * @property {string} gameId
 *
 * @param {PlayerCreateFormProps} param0
 */
export default function PlayerCreateForm({ busy, defaultName = "My new player", gameId }) {
  const t = useTranslation("games");

  const player = {
    name: defaultName,
    avatar: {},
    gameId,
  };

  /**
   * @param {FormData} formData
   */
  async function handleSubmit(formData) {
    "use server";
    const res = await clientServer.createPlayer(gameId, {
      name: formData.get("name"),
    });

    revalidatePath(`/games/${gameId}`);
    console.log(res);
  }

  return (
    <form action={handleSubmit} aria-busy={busy}>
      <PlayerForm player={player} />

      <input type="submit" className="btn btn-primary" disabled={busy} value={t("PlayerCreateForm.submit")} />
    </form>
  );
}
