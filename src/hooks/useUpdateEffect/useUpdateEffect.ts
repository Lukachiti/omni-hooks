import { useEffect, useRef, DependencyList } from 'react';

function useUpdateEffect(
    effect: () => void | (() => void),
    dependencies?: DependencyList
): void {
    // useRef to track if this is the first render
    const isFirstRender = useRef(true);

    useEffect(() => {
        // On first render, skip the effect and just set the flag to false
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // On all subsequent renders, run the effect
        return effect();
    }, dependencies);
}

export default useUpdateEffect;

