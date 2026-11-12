"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function TopBanner() {
  const t = useTranslations("b2b");
  const lang = useLocale();
  const pathname = usePathname();

  const segments = (pathname ?? "").split("/").filter(Boolean);
  const isGamePage = segments[1] === "games" && segments.length >= 3;

  if (isGamePage) return null;

  return (
    <div className="bg-secondary text-secondary-content border-b border-secondary-content/10">
      <div className="container mx-auto px-4 max-w-6xl py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-sm md:text-base opacity-95">{t("homeBanner.text")}</p>
        <Link
          href={`/${lang}/team-building`}
          className="btn btn-sm btn-outline btn-secondary-content whitespace-nowrap"
        >
          {t("homeBanner.cta")} →
        </Link>
      </div>
    </div>
  );
}
