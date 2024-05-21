import InputWithLabel from "@/components/server/InputWithLabel";
import { useTranslations as useTranslation } from "next-intl";

/**
 * @import {GameRecord} from '@/models'
 * @typedef GameFormProps
 * @property {GameRecord} [game]
 *
 * @param {GameFormProps} param0
 */
export default function GameForm({ game }) {
  const t = useTranslation("common");

  return (
    <>
      <InputWithLabel label={t("GameForm.nameField")} name="name" defaultValue={game.name} className="mb-3" required />
      <div className="form-control w-full mb-3">
        <label className="label">
          <span className="label-text">{t("GameForm.actionsField")}</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="actions"
          defaultValue={game.actions.map((a) => a.name).join("\n")}
        ></textarea>
      </div>
      <input type="submit" className="btn btn-primary" value={t("GameForm.submit")} />
    </>
  );
}
