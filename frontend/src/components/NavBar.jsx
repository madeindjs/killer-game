import Link from "next/link";
import QuickJump from "./QuickJump";

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Killer game
        </Link>
      </div>
      <div className="navbar-end">
        <QuickJump />
      </div>
    </div>
  );
}
