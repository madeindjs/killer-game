import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import type { ApplicationStats } from "@killer-game/types";

/**
 * @typedef Return
 * @property {boolean} loading
 * @property {any} error
 * @property {ApplicationStats | undefined} stats
 */

/**
 * @returns {Return}
 */
export function useApplicationStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [stats, setStats] = useState<ApplicationStats>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    client
      .fetchApplicationStats()
      .then(setStats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, stats };
}
