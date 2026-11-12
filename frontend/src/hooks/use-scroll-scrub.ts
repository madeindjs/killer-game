"use client";

import { useEffect, useState, type RefObject } from "react";

interface ScrollScrubResult {
  activeStep: number;
  progress: number;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useScrollScrub(
  ref: RefObject<HTMLElement | null>,
  steps: number,
): ScrollScrubResult {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || steps <= 0) return;

    let frame = 0;

    function compute() {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollable = rect.height - viewportHeight;

      if (scrollable <= 0) {
        setProgress(0);
        setActiveStep(0);
        return;
      }

      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));
      const nextProgress = scrolled / scrollable;
      setProgress(nextProgress);
      setActiveStep(Math.min(steps - 1, Math.floor(nextProgress * steps)));
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, steps]);

  return { activeStep, progress };
}
