"use client";
import { useEffect, useState } from "react";

/**
 * @param {{startedAt: string}} param0
 */
export function TimeSinceStartedCountDown({ startedAt }) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const startedAtDate = new Date(startedAt);
    const timer = setTimeout(() => {
      const diff = new Date(new Date() - startedAtDate);

      setSeconds(diff.getUTCSeconds());
      setMinutes(diff.getUTCMinutes());
      setHours(diff.getUTCHours());
    }, 1_000);
    return () => clearTimeout(timer);
  }, [startedAt]);

  return (
    <span className="countdown font-mono text-2xl">
      <span style={{ "--value": hours }}></span>h<span style={{ "--value": minutes }}></span>m
      <span style={{ "--value": seconds }}></span>s
    </span>
  );
}
