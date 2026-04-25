import { useState, useEffect, useRef } from "react";

type StoredData<T> = {
    value: T;
    expiry?: number;
};

type useLocalStorageReturn<T> = {
    value: T;
    setValue: (newValue: T) => void;
    remove: () => void;
    getValue: () => T | null;
    changeKey:(newKey: string) => void;
    setTimer:(newValue: T, durationMs: number) => void;
    clearStorage:() => void;
}

const useLocalStorage = <T>(key: string, initialValue: T) : useLocalStorageReturn<T> => {
    const removedRef = useRef(false);

    const [value, setValue] = useState<T>(() => {
        try {
          const stored = localStorage.getItem(key);
          if (!stored) return initialValue;

          const parsed: StoredData<T> | T = JSON.parse(stored);

          if (
            parsed !== null &&
            typeof parsed === "object" &&
            "expiry" in parsed &&
            parsed.expiry &&
            Date.now() > parsed.expiry
          ) {
            localStorage.removeItem(key);
            return initialValue;
          }

          return (parsed as StoredData<T>)?.value ?? (parsed as T);
        } catch {
          return initialValue;
        }
    });

    const store = (newValue: T):void => {
        try {
          if (typeof window !== "undefined") {
            const data: StoredData<T> = { value: newValue };
            window.localStorage.setItem(key, JSON.stringify(data));
          }
          setValue(newValue);
        } catch {
          console.warn("Error setting localStorage key");
        }
    };

    const remove = ():void => {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(key);
          }
          removedRef.current = true;
          setValue(initialValue);
        } catch {
          console.warn("Error removing localStorage key");
        }
    };

    const getValue = (): T | null => {
      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) return null;

        const parsed: StoredData<T> | T = JSON.parse(stored);

        if (
          parsed !== null &&
          typeof parsed === "object" &&
          "expiry" in parsed &&
          parsed.expiry &&
          Date.now() > parsed.expiry
        ) {
          localStorage.removeItem(key);
          return null;
        }

        return (parsed as StoredData<T>)?.value ?? (parsed as T);
      } catch {
        console.warn("Error getting value from localStorage");
        return null;
      }
    };

    const changeKey = (newKey: string): void => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          localStorage.setItem(newKey, stored);
          localStorage.removeItem(key);
        }
      } catch {
        console.warn("Error changing key from localStorage");
      }
    };

    const setTimer = (newValue: T, durationMs: number): void => {
      try {
        const expiry = Date.now() + durationMs;
        const data: StoredData<T> = { value: newValue, expiry };
        localStorage.setItem(key, JSON.stringify(data));
        setValue(newValue);
      } catch {
        console.warn("Error setting timer in localStorage");
      }
    };

    const clearStorage = (): void => {
      try {
        localStorage.clear();
        removedRef.current = true;
        setValue(initialValue);
      } catch {
        console.warn("Error clearing localStorage");
      }
    };

    useEffect(() => {
      if (removedRef.current) {
        removedRef.current = false;
        return;
      }
      try {
        const existing = localStorage.getItem(key);
        if (existing) {
          const parsed: StoredData<T> = JSON.parse(existing);
          if (parsed?.expiry) return;
        }
        localStorage.setItem(key, JSON.stringify({ value }));
      } catch {
        console.warn("Error in useEffect syncing localStorage");
      }
    }, [key, value]);

    return {
        value,
        setValue: store,
        remove,
        getValue,
        changeKey,
        setTimer,
        clearStorage,
    };
};

export default useLocalStorage;