import { useState, useEffect } from "react";

/**
 * Returns a debounced value that only updates after the given delay has elapsed
 * without the input changing. Useful to debounce user input before making
 * requests.
 *
 * @param {any} value - the value to debounce
 * @param {number} delay - debounce delay in ms (default 300)
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debouncedValue;
}
