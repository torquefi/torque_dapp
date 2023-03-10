import { useEffect, useState } from "react";

export default function useDebounce(
  value: any,
  delay: number,
  clearIfEmpty: boolean = true
) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  let timeout: any;

  useEffect(() => {
    if (clearIfEmpty && !value) {
      clearTimeout(timeout);
      setDebouncedValue(value);
      return;
    }

    timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}
