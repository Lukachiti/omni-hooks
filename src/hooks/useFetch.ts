import { useState, useEffect } from 'react'

const useFetch = (url: string | null) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();
        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(url, { signal: controller.signal });

                if (!res.ok) {
                    throw new Error("error");
                }

                const result = await res.json();
                if (mounted) {
                    setData(result);
                }

            } catch (error: any) {
                if (error.name !== "AbortError" && mounted) {
                    setError(error.message);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => {
            mounted = false;
            controller.abort();
        };
    }, [url])

    return { data, loading, error }
}

export default useFetch;