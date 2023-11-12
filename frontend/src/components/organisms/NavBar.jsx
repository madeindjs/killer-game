import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function NavBar() {
  const { t, lang } = useTranslation("common");
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href={`/${lang}`} className="btn btn-ghost normal-case text-xl">
          {t("appName")}
        </Link>
      </div>
      <div className="navbar-end">
        <Link href={`/${lang}/games`} className="btn btn-ghost normal-case text-xl">
          {t("NavBar.games")}
        </Link>
      </div>
    </div>
  );
}
