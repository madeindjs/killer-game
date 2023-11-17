import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function Footer() {
  const { t, lang } = useTranslation("common");

  return (
    <footer className="footer p-10 text-neutral-content">
      <nav>
        <header className="footer-title">{t("Footer.sitemap")}</header>
        <Link className="link link-hover" href={`/${lang}/help`}>
          {t("Footer.help")}
        </Link>
        <Link className="link link-hover" href={`/${lang}/actions`}>
          {t("Footer.actions")}
        </Link>
        <Link className="link link-hover" href={`/${lang === "en" ? "fr" : "en"}`} hrefLang={"en" ? "fr" : "en"}>
          {t("Footer.switchLang")}
        </Link>
      </nav>
      <nav>
        <header className="footer-title">{t("Footer.externalLinks")}</header>
        <Link className="link link-hover" href="https://rsseau.fr">
          {t("Footer.aboutMe")}
        </Link>
        {/* <Link className="link link-hover" href="https://github.com/madeindjs/killer-game">
          {t("Footer.github")}
        </Link> */}
      </nav>
    </footer>
  );
}
