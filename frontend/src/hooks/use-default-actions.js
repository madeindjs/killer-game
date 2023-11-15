import useTranslation from "next-translate/useTranslation";

/**
 * @returns {string[]}
 */
export function useDefaultActions() {
  const { t } = useTranslation("actions");
  return t("defaultActions", {}, { returnObjects: true });
}
