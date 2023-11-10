import useTranslation from "next-translate/useTranslation";

export default function AboutPage() {
  const { t, lang } = useTranslation("about");
  return (
    <>
      <h1>{t("title")}</h1>
    </>
  );
}
