import { useState, useEffect } from 'react';

export function useIdle(timeout: number = 0): boolean {
    const [idle, setIdle] = useState<boolean>(false);

    useEffect(() => {
        let time: ReturnType<typeof setTimeout>;

        const reset = () => {
            clearTimeout(time);
            setIdle(false);
            time = setTimeout(() => {
                setIdle(true);
            }, timeout);
        };

        reset();

        const events: string[] = ['mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, reset));

        return () => {
            clearTimeout(time);
            events.forEach((event) => window.removeEventListener(event, reset));
        };
    }, [timeout]);

    return idle;
} 