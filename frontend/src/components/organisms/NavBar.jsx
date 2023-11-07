import { DEFAULT_LANG } from "@/lib/i18n";
import Link from "next/link";

/**
 * @typedef Props
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function NavBar({ lang = DEFAULT_LANG }) {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Killer game
        </Link>
      </div>
      <div className="navbar-end">{/* <QuickJump /> */}</div>
    </div>
  );
}
