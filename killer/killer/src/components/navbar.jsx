import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <strong>
            <Link href="/">Killer</Link>
          </strong>
        </li>
      </ul>

      <ul>
        <li>
          <Link href="/games">My games</Link>
        </li>

        <li>
          <Link href="/games/new" role="button">
            Create new game
          </Link>
        </li>
      </ul>
    </nav>
  );
}
