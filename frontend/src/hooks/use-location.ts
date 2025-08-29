import { useEffect, useState } from "react";

export function useLocationOrigin() {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (window !== undefined) setValue(window.location.origin);
  }, []);
  return value;
}

export function useLocationPathnameWithSearch() {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (window === undefined) return;

    const path = `${window.location.pathname}${window.location.search}`;
    setValue(path);
  }, []);
  return value;
}
