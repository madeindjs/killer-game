"use client";

import { useLocationOrigin, useLocationPathnameWithSearch } from "@/hooks/use-location";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 *
 * @param {string} path
 * @param {'en' | 'fr'} lang
 * @returns
 */
function changeLocale(path, lang) {
  switch (lang) {
    case "en":
      return path.replace("/fr/", "/en/");
    case "fr":
      return path.replace("/en/", "/fr/");
  }
}

export default function LangSwitcher() {
  useState();
  useLocationOrigin;
  const pathname = useLocationPathnameWithSearch();

  const isEn = pathname?.startsWith("/en/");
  const isFr = pathname?.startsWith("/fr/");

  const router = useRouter();

  function onChange(lang) {
    router.push(changeLocale(pathname, lang));
  }

  return (
    <select className="select" onChange={(e) => onChange(e.target.value)}>
      <option disabled={isFr} selected={isFr} value="fr">
        🇫🇷
      </option>
      <option disabled={isEn} selected={isEn} value="en">
        🇬🇧
      </option>
    </select>
  );
  return (
    <details className="dropdown">
      <summary className="m-1 btn">open or close</summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </details>
  );
}
