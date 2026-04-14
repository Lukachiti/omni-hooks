import { useState, useEffect, useRef } from "react";

/**
 
Options for throttle behavior*/
interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export const useThrottle = <T>(
  value: T,
  delay: number = 500,
  { leading = true, trailing = true }: ThrottleOptions = {}
): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValue = useRef<T>(value);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastExecuted.current;
    const remaining = delay - timeSinceLast;

    lastValue.current = value;

    // Leading edge execution
    if (leading && lastExecuted.current === 0) {
      setThrottledValue(value);
      lastExecuted.current = now;
      return;
    }

    // Interval execution
    if (remaining <= 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setThrottledValue(value);
      lastExecuted.current = now;
      return;
    }

    // Trailing edge execution
    if (trailing && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(lastValue.current);
        lastExecuted.current = Date.now();
        timeoutRef.current = null;
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay, leading, trailing]);

  return throttledValue;
};