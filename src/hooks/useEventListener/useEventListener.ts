import { useEffect, useRef } from 'react'

const useEventListener = (
    eventType: string,
    callback: (event: Event) => void,
    elementRef?: React.RefObject<HTMLElement | null>
) => {
    const callbackRef = useRef<(event: Event) => void>(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        const element = elementRef?.current ?? window
        if (!element.addEventListener) return

        const eventListener = (event: Event) => {
            callbackRef.current(event)
        }

        element.addEventListener(eventType, eventListener)

        return () => {
            element.removeEventListener(eventType, eventListener)
        }
    }, [eventType, elementRef])
}
export default useEventListener;
