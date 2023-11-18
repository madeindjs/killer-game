import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import AlertWarning from "./AlertWarning";

export default function BetaWarning() {
  const { t } = useTranslation("common");
  return (
    <AlertWarning>
      {t("betaWarning")}
      <br />
      <Link href="mailto:alexandre@rsseau.fr" className="link">
        alexandre@rsseau.fr
      </Link>
    </AlertWarning>
  );
}
