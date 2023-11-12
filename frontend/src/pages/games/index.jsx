import GamesCreated from "@/components/pages/GamesCreated";
import RootLayout from "@/components/templates/layout";
import useTranslation from "next-translate/useTranslation";

export default function GamesPages() {
  const { lang, t } = useTranslation();

  return (
    <RootLayout lang={lang}>
      <GamesCreated />
    </RootLayout>
  );
}
