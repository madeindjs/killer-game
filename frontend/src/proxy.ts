import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { getGameJoinUrl } from "./lib/routes";

const intlMiddleware = createMiddleware(routing);

/**
 * Matches the localized short invitation link: `/{locale}/join/{gameIdOrSlug}`.
 *
 * The unprefixed link shared by organizers (`/join/{gameIdOrSlug}`) is first
 * redirected by the i18n middleware to the participant's locale, then caught
 * here and redirected to the game's join page.
 */
const INVITE_PATH = new RegExp(`^/(${routing.locales.join("|")})/join/([^/]+)/?$`);

export default function proxy(request: NextRequest) {
  const match = INVITE_PATH.exec(request.nextUrl.pathname);
  if (match) {
    const [, locale, gameId] = match;
    const url = request.nextUrl.clone();
    url.pathname = getGameJoinUrl({ id: gameId, slug: gameId }, locale);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/"],
};
