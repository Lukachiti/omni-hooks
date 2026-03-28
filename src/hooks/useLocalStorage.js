import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {

    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);

            if (stored !== null) {
                return JSON.parse(stored);
              }

            return initialValue;
        } catch (error) {
            console.error("localStorage read error:", error);
            return initialValue;
          }
    });

    useEffect(() => {
        try {
              localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
              console.error("localStorage write error:", error);
          }
    }, [key, value]);

    const setStoredValue = (newValue) => {
        setValue(newValue);
    };

    const remove = () => {
        try {
            localStorage.removeItem(key);
            setValue(null);
        } catch (error) {
            console.error("localStorage remove error:", error);
        }
    };

    return { value, setStoredValue, remove };
};