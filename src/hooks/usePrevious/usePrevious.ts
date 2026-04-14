import { useRef, useState, useEffect } from "react";

const usePrevious = <T>(value: T, options: {
    historySize?: number;
    initialValue?: T;
    storageKey?: string | null;
} = {}) => {
    // historySize = how many values we keep in history
    // initialValue = starting value
    // storageKey = history will also be saved in localStorage if provided
    const { historySize = 5, initialValue = value, storageKey = null } = options;

    // used to ignore the next update when undo/redo changes the value
    const ignoreNextChange = useRef<boolean>(false);

    // used to skip the first render
    const isFirstRender = useRef<boolean>(true);

    // load history from localStorage if a key was provided
    const getInitialHistory = (): T[] => {
        if (storageKey) {
            const stored = localStorage.getItem(storageKey);
            if (stored) return JSON.parse(stored);
        }

        // otherwise start with the initial value
        return initialValue !== undefined ? [initialValue] : [];
    };

    const [history, setHistory] = useState<T[]>(getInitialHistory);

    // pointer shows where we are in the history array
    const [pointer, setPointer] = useState<number>(history.length - 1);

    // save history to localStorage
    const saveHistory = (newHistory: T[]): void => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(newHistory));
        }
    };

    useEffect(() => {
        // skip the first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // skip updates caused by undo/redo
        if (ignoreNextChange.current) {
            ignoreNextChange.current = false;
            return;
        }

        // only add to history if the value really changed
        if (value !== history[pointer]) {
            const updatedHistory = [
                ...history.slice(0, pointer + 1), // remove redo history if user typed again
                value,
            ].slice(-historySize); // keep history within the size limit

            setHistory(updatedHistory);
            setPointer(updatedHistory.length - 1);
            saveHistory(updatedHistory);
        }
    }, [value]);

    const undo = (): T | undefined => {
        const newPointer = Math.max(pointer - 1, 0);

        // tell the hook to ignore the next value change
        ignoreNextChange.current = true;

        setPointer(newPointer);
        return history[newPointer];
    };

    const redo = (): T | undefined => {
        const newPointer = Math.min(pointer + 1, history.length - 1);

        // prevent this change from being added to history
        ignoreNextChange.current = true;

        setPointer(newPointer);
        return history[newPointer];
    };

    const resetHistory = (): void => {
        const current = history[pointer];
        const updatedHistory = [current];

        setHistory(updatedHistory);
        setPointer(0);
        saveHistory(updatedHistory);
    };

    const clear = (): void => {
        const updatedHistory = [initialValue];

        setHistory(updatedHistory);
        setPointer(0);
        saveHistory(updatedHistory);
    };

    const popPrevious = (): void => {
        // remove the last value from history
        const updatedHistory = history.slice(0, history.length - 1);

        setHistory(updatedHistory);
        setPointer(Math.min(pointer, updatedHistory.length - 1));
        saveHistory(updatedHistory);
    };

    // return a copy so the original history can't be changed outside the hook
    const peekHistory = (): T[] => [...history];

    // get a value N steps back
    const getPreviousN = (n: number = 1): T | undefined => {
        const index = pointer - n;
        return index >= 0 ? history[index] : undefined;
    };

    return {
        previous: history[pointer - 1], // last value before the current one
        history,
        pointer,
        undo,
        redo,
        resetHistory,
        clear,
        popPrevious,
        peekHistory,
        getPreviousN,
    };
};

export default usePrevious;