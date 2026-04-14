import { useState, useEffect, useRef, useCallback } from 'react';

const useToggle = (key = 'toggle', initialValue = false) => {
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved !== null ? JSON.parse(saved) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const [history, setHistory] = useState([value]);
    const [locked, setLocked] = useState(false);
    const timeOutRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    useEffect(() => {
        return () => {
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
        };
    }, []);

    const toggle = useCallback(() => {
        if (locked) return;
        setValue(prev => {
            const next = !prev;
            setHistory(h => [...h, next]);
            return next;
        });
    }, [locked]);

    const undo = () => {
        if (history.length <= 1) return;
        const newHistory = [...history];
        newHistory.pop();
        const previousValue = newHistory[newHistory.length - 1];
        setHistory(newHistory);
        setValue(previousValue);
    };

    const toggleAfter = (ms = 1000) => {
        if (locked) return;
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
            toggle();
            timeOutRef.current = null;
        }, ms);
    };

    const reset = () => {
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        setValue(initialValue);
        setHistory([initialValue]);
    };

    const toggleLocked = () => setLocked(prev => !prev);

    return { value, toggle, toggleAfter, undo, reset, history, locked, toggleLocked };
};

export default useToggle;