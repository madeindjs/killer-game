import { useTranslations } from "next-intl";

export default function Empty() {
  const t = useTranslations("common");
  return (
    <div className={"alert"}>
      <span className="shrink-0 h-6 w-6 text-xl">🤷</span>
      <span>{t("emptyData")}</span>
    </div>
  );
}
