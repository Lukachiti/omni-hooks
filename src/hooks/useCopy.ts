import { useState, useCallback, useRef, useEffect } from "react";

type UseCopyReturn = {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
};

function useCopy(timeout: number = 2000): UseCopyReturn {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    if (text === undefined || text === null) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, timeout);

      return true;
    } catch {
      return false;
    }
  }, [timeout]);

  const reset = useCallback(() => {
    setCopied(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy, reset };
}

export default useCopy;