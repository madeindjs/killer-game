"use client";
import { useEffect, useState } from "react";

/**
 * @param {{startedAt: string, stop?: boolean, className?: string}} param0
 */
export function TimeSinceStartedCountDown({ startedAt, stop, className }) {
  const startedAtDate = new Date(startedAt);
  const diff = new Date(new Date() - startedAtDate);

  const [seconds, setSeconds] = useState(diff.getUTCSeconds());
  const [minutes, setMinutes] = useState(diff.getUTCMinutes());
  const [hours, setHours] = useState(diff.getUTCHours());

  useEffect(() => {
    if (stop) return;
    const startedAtDate = new Date(startedAt);
    const timer = setInterval(() => {
      const diff = new Date(new Date() - startedAtDate);

      setSeconds(diff.getUTCSeconds());
      setMinutes(diff.getUTCMinutes());
      setHours(diff.getUTCHours());
    }, 1_000);
    return () => clearInterval(timer);
  }, [startedAt, stop]);

  return (
    <span className={"countdown font-mono text-2xl " + (className ?? "")}>
      <span style={{ "--value": hours }}></span>h<span style={{ "--value": minutes }}></span>m
      <span style={{ "--value": seconds }}></span>s
    </span>
  );
}
