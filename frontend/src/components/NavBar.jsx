import Link from "next/link";

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Killer game
        </Link>
      </div>
      {/* <div className="navbar-end">
        <div className="join">
          <a className="btn join-item" href="/join">
            Join a game
          </a>
          <a className="btn join-item btn-primary" href="/new">
            Create a game
          </a>
        </div>
      </div> */}
    </div>
  );
}
