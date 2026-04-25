import { useState, useEffect } from "react";

type UseResponsiveReturn = {
    width: number;
    matches: boolean;
};

const useResponsive = (query: string): UseResponsiveReturn => {
    const isClient = typeof window !== "undefined";

    const [width, setWidth] = useState<number>(
        isClient ? window.innerWidth : 0
    );

    const [matches, setMatches] = useState<boolean>(
        isClient ? window.matchMedia(query).matches : false
    );

    useEffect(() => {
        if (!isClient) return;

        const media: MediaQueryList = window.matchMedia(query);

        const handleResize = (): void => {
            setWidth(window.innerWidth);
            setMatches(media.matches);
        };

        window.addEventListener("resize", handleResize);
        media.addEventListener("change", handleResize);

        
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            media.removeEventListener("change", handleResize);
        };
    }, [query, isClient]);

    return { width, matches };
}

export default useResponsive;