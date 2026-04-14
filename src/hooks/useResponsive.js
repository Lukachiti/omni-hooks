import { useState, useEffect } from "react";

export default function useResponsive(query) {
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 0,
    );

    const [matches, setMatches] = useState(
        typeof window !== "undefined" ? window.matchMedia(query).matches : false,
    );

    useEffect(() => {
        const media = window.matchMedia(query);

        const handleResize = () => {
            setWidth(window.innerWidth);
            setMatches(media.matches);
        };

        window.addEventListener("resize", handleResize);
        media.addEventListener("change", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            media.removeEventListener("change", handleResize);
        };
    }, [query]);

    return { width, matches };
}