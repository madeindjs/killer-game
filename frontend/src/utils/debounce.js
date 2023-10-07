import { useEffect, useMemo, useRef } from "react";

/**
 * @param {Function} callback
 * @param {number} ms
 */
export function debounce(callback, ms) {
  let timer = null;

  return (...args) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, ms);
  };
}

/**
 * @see https://www.developerway.com/posts/debouncing-in-react
 * @param {Function} callback
 * @param {number} ms
 * @returns {Function}
 */
export function useDebounce(callback, ms) {
  const ref = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args) => {
      ref.current?.(...args);
    };

    return debounce(func, ms);
  }, []);

  return debouncedCallback;
}
