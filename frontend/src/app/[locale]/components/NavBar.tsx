import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import LangSwitcher from "./LangSwitcher";

export default function NavBar() {
  const t = useTranslations("common");
  const lang = useLocale();
  return (
    <div className="navbar gap-2">
      <div className="navbar-start">
        <Link href={`/${lang}`} className="btn btn-ghost normal-case px-2 text-lg sm:px-4 sm:text-xl">
          {t("appName")}
        </Link>
      </div>
      <div className="navbar-end">
        <Link href={`/${lang}/games`} className="btn btn-ghost normal-case px-2 text-lg sm:px-4 sm:text-xl">
          {t("NavBar.games")}
        </Link>
        <LangSwitcher />
      </div>
    </div>
  );
}
