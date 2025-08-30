import { useTranslations } from "next-intl";
import AlertWarning from "./AlertWarning";

export default function AlertWarningUrlToken() {
  const t = useTranslations("common");
  return <AlertWarning>{t("dontShareUrl")}</AlertWarning>;
}
