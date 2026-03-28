    import { useState, useEffect, useRef } from 'react'

const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem('toggle')
        return saved !== null ? JSON.parse(saved) : initialValue
    })
    const [history, setHistory] = useState([value])
    const [locked, setLocked] = useState(false);
    const timeOutRef = useRef()

    const toggle = () => {
        if (locked) return;
        setValue(prev => {
            const next = !prev;
            setHistory(prevHistory => [...prevHistory, next]);
            return next;
        });
    };

    const undo = () => {
        setHistory(prevHistory => {
            if (prevHistory.length <= 1) return prevHistory;
            const newHistory = prevHistory.slice(0, -1);
            setValue(newHistory[newHistory.length - 1]);
            return newHistory;
        });
    };

    const toggleAfter = (ms = 1000) => {
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
        }
        timeOutRef.current = setTimeout(() => {
            setValue(prev => {
                const next = !prev
                setHistory(prevHistory => [...prevHistory, next])
                return next
            });
            timeOutRef.current = null
        }, ms);
    };

    const reset = () => {
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
            timeOutRef.current = null
        }
        setValue(initialValue)
        setHistory([initialValue])
    }
    useEffect(() => {
        localStorage.setItem("toggle", JSON.stringify(value));
    }, [value]);

    const toggleLocked = () => setLocked(prev => !prev);

    return { toggle, toggleAfter, undo, reset, history, toggleLocked }
}
export default useToggle