import useTranslation from "next-translate/useTranslation";
import IconWarning from "../atoms/IconWarning";

/**
 * @typedef Props
 *
 * @param {Props} param0
 */
export default function Unauthorized({ children }) {
  const { t } = useTranslation("common");
  return (
    <div className="alert alert-error">
      <IconWarning />
      <div>
        <h3 className="font-bold">{t("Unauthorized.title")}</h3>
        <div className="text-xs">{children}</div>
      </div>
    </div>
  );
}
