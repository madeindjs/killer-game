"use client";
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
      <InputWithLabel label={t("GameForm.nameField")} name="name" className="mb-3" required />
      <InputWithLabel label={t("GameForm.passwordField")} name="password" className="mb-3" required type="password" />
      <input type="submit" className="btn btn-primary" value={t("GameForm.submit")} />
    </>
  );
}
