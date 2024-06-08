import { useEffect, useState } from "react";

export function useLocationOrigin() {
  const [origin, setOrigin] = useState();
  useEffect(() => {
    if (window !== undefined) setOrigin(window.location.origin);
  }, []);
  return origin;
}
