import { useTranslations as useTranslation } from "next-intl";
import AlertWarning from "../molecules/AlertWarning";

export default function Empty() {
  const t = useTranslation("common");
  return (
    <div className={"alert"}>
      <span className="shrink-0 h-6 w-6 text-xl">🤷</span>
      <span>{t("emptyData")}</span>
    </div>
  );
  return <AlertWarning></AlertWarning>;
}
