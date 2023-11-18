import useTranslation from "next-translate/useTranslation";
import AlertWarning from "./AlertWarning";

/**
 * @typedef Props
 * @property {string} content
 *
 * @param {Props} param0
 */
export default function AlertWarningUrlToken({ content }) {
  const { t } = useTranslation("common");
  return <AlertWarning>{t("dontShareUrl")}</AlertWarning>;
}
