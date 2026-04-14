import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialValue;

      const parsed = JSON.parse(stored);

      if (parsed?.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return initialValue;
      }

      return parsed?.value ?? parsed;
    } catch {
      return initialValue;
    }
  });

  const store = (newValue) => {
    try {
      if (typeof window !== "undefined") {
        const data = { value: newValue };
        window.localStorage.setItem(key, JSON.stringify(data));
      }
      setValue(newValue);
    } catch {
      console.warn("Error setting localStorage key");
    }
  };

  const remove = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setValue(initialValue);
    } catch {
      console.warn("Error removing localStorage key");
    }
  };

  const getValue = () => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      if (parsed?.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed?.value ?? parsed;
    } catch {
      console.warn("Error getting value from localStorage");
    }
  };

  const changeKey = (newKey) => {
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

  const setTimer = (newValue, durationMs) => {
    try {
      const expiry = Date.now() + durationMs;

      const data = {
        value: newValue,
        expiry,
      };

      localStorage.setItem(key, JSON.stringify(data));
      setValue(newValue);
    } catch {
      console.warn("Error setting timer in localStorage");
    }
  };

  const clearStorage = () => {
    try {
      localStorage.clear();
      setValue(initialValue);
    } catch {
      console.warn("Error clearing localStorage");
    }
  };

  useEffect(() => {
    const existing = localStorage.getItem(key);

    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed?.expiry) return;
    }

    localStorage.setItem(key, JSON.stringify({ value }));
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