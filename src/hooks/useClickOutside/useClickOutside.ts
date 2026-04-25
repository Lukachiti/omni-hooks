import { useEffect, RefObject } from "react";

type ClickOutsideOptions = {
    eventType?: "mousedown" | "click" | "touchstart";
    enabled?: boolean;
};

const useClickOutside = (
    refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
    handler: (event: Event) => void,
    { eventType = "mousedown", enabled = true }: ClickOutsideOptions = {}
) => {
    useEffect(() => {
      if (!enabled) return;

      const refList = Array.isArray(refs) ? refs : [refs];

      const handleClick = (event: Event) => {
        const isInside = refList.some(ref => ref.current?.contains(event.target as Node));
        if (!isInside) handler(event);
      };

      document.addEventListener(eventType, handleClick);
      return () => document.removeEventListener(eventType, handleClick);
    }, [refs, handler, eventType, enabled]);
};

export default useClickOutside;