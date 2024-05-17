import { useTranslation } from "../../utils/use-translation";

export default function NavBar() {
  const { t, lang } = useTranslation("common");
  return (
    <div className="navbar">
      <div className="navbar-start">
        <a href={`/${lang}`} className="btn btn-ghost normal-case text-xl">
          {t("appName")}
        </a>
      </div>
      <div className="navbar-end">
        <a href={`/${lang}/games`} className="btn btn-ghost normal-case text-xl">
          {t("NavBar.games")}
        </a>
      </div>
    </div>
  );
}
