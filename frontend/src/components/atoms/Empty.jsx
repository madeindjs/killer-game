import useTranslation from "next-translate/useTranslation";
import AlertWarning from "../molecules/AlertWarning";

export default function Empty() {
  const { t } = useTranslation("common");
  return <AlertWarning>{t("emptyData")}</AlertWarning>;
}
