import { useTranslations } from "next-intl";
import AlertWarning from "./AlertWarning";

/**
 * @typedef Props
 * @property {string} content
 *
 * @param {Props} param0
 */
export default function AlertWarningUrlToken({ content }) {
  const t = useTranslations("common");
  return <AlertWarning>{t("dontShareUrl")}</AlertWarning>;
}
