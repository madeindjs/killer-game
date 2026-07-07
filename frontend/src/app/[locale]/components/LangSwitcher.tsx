"use client";

import {
  useLocationPathnameWithSearch,
} from "@/hooks/use-location";
import { useRouter } from "next/navigation";

function changeLocale(path: string, lang: "en" | "fr") {
  if (path === "/") return `/${lang}`;

  switch (lang) {
    case "en":
      return path.replace(/^\/fr/, "/en");
    case "fr":
      return path.replace(/^\/en/, "/fr");
  }
}

export default function LangSwitcher() {
  const pathname = useLocationPathnameWithSearch();

  const isEn = pathname?.startsWith("/en");
  const isFr = pathname?.startsWith("/fr");

  const router = useRouter();

  function onChange(lang: string) {
    if (lang === "en" || lang === "fr")
      router.push(changeLocale(pathname, lang));
  }

  return (
    <select
      className="select select-bordered min-h-[2.75rem]"
      onChange={(e) => onChange(e.target.value)}
      value={isEn ? "en" : "fr"}
      aria-label="Language"
    >
      <option disabled={isFr} value="fr">
        🇫🇷
      </option>
      <option disabled={isEn} value="en">
        🇬🇧
      </option>
    </select>
  );
}
