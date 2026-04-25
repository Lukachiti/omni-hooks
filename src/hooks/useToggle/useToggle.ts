import { useState, useEffect, useRef, useCallback } from 'react';

interface UseToggleReturn {
    value: boolean;
    toggle: () => void;
    toggleAfter: (ms?: number) => void;
    undo: () => void;
    reset: () => void;
    history: boolean[];
    locked: boolean;
    toggleLocked: () => void;
}

const useToggle = (key: string = 'toggle', initialValue: boolean = false): UseToggleReturn => {
    const [value, setValue] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved !== null ? (JSON.parse(saved) as boolean) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const [history, setHistory] = useState<boolean[]>([value]);
    const [locked, setLocked] = useState<boolean>(false);
    const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    useEffect(() => {
        return () => {
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
        };
    }, []);

    const toggle = useCallback((): void => {
        if (locked) return;
        setValue((prev) => {
            const next = !prev;
            setHistory((h) => [...h, next]);
            return next;
        });
    }, [locked]);

    const undo = useCallback((): void => {
        if (history.length <= 1) return;
        setHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            newHistory.pop();
            const previousValue = newHistory[newHistory.length - 1];
            setValue(previousValue);
            return newHistory;
        });
    }, [history]);

    const toggleAfter = useCallback((ms: number = 1000): void => {
        if (locked) return;
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        
        timeOutRef.current = setTimeout(() => {
            toggle();
            timeOutRef.current = null;
        }, ms);
    }, [locked, toggle]);

    const reset = useCallback((): void => {
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        setValue(initialValue);
        setHistory([initialValue]);
    }, [initialValue]);

    const toggleLocked = useCallback((): void => {
        setLocked((prev) => !prev);
    }, []);

    return { 
        value, 
        toggle, 
        toggleAfter, 
        undo, 
        reset, 
        history, 
        locked, 
        toggleLocked 
    };
};

export default useToggle