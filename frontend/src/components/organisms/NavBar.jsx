import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function NavBar() {
  const { t } = useTranslation("common");
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          {t("appName")}
        </Link>
      </div>
      <div className="navbar-end">{/* <QuickJump /> */}</div>
    </div>
  );
}
