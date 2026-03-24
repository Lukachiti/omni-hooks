import React, { } from 'react'
import { useState, useEffect } from 'react'

const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue)
    const [history, setHistory] = useState([])
    const [locked, setLocked] = useState(false);

    const toggle = () => {
        if (locked) return;
        setValue(prev => {
            const next = !prev;
            setHistory(h => [...h, next]);
            return next;
        });
    };

    const undo = () => {
        setHistory(h => {
            if (h.length <= 1) return h;
            const newHistory = h.slice(0, -1);
            setValue(newHistory[newHistory.length - 1]);
            return newHistory;
        });
    };

    const toggleAfter = (ms = 1000) => {
        setTimeout(() => {
            setValue(prev => !prev);
        }, ms);
    };

    const reset = () => {
        setValue(initialValue)
    }
    useEffect(() => {
        localStorage.setItem("toggle", JSON.stringify(value));
    }, [value]);

    return [toggle, toggleAfter, undo, reset, history, setLocked]
}
export default useToggle