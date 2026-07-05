"use client";

import { useEffect, useState } from "react";

type TimeSinceStartedCountDownProps = {
  startedAt: string;
  stop?: boolean;
  className?: string;
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function TimeSinceStartedCountDown({
  startedAt,
  stop,
  className,
}: TimeSinceStartedCountDownProps) {
  const startedAtDate = new Date(startedAt);
  const initialDiff = new Date(new Date().getTime() - startedAtDate.getTime());

  const [seconds, setSeconds] = useState(initialDiff.getUTCSeconds());
  const [minutes, setMinutes] = useState(initialDiff.getUTCMinutes());
  const [hours, setHours] = useState(initialDiff.getUTCHours());

  useEffect(() => {
    if (stop) return;
    const interval = setInterval(() => {
      const diff = new Date(new Date().getTime() - startedAtDate.getTime());
      setSeconds(diff.getUTCSeconds());
      setMinutes(diff.getUTCMinutes());
      setHours(diff.getUTCHours());
    }, 1_000);
    return () => clearInterval(interval);
  }, [startedAtDate, stop]);

  return (
    <span
      className={"font-mono text-2xl " + (className ?? "")}
      aria-live="polite"
    >
      <span>{pad(hours)}</span>h<span>{pad(minutes)}</span>m
      <span>{pad(seconds)}</span>s
    </span>
  );
}