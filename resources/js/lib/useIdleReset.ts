import { useEffect, useRef } from 'react';

/**
 * Resets a kiosk session back to the attract screen after a period of no touch
 * activity, so an abandoned session doesn't block the next visitor.
 */
export function useIdleReset(onIdle: () => void, timeoutMs = 60_000, active = true): void {
    const timer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (!active) {
            return;
        }

        const reset = () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(onIdle, timeoutMs);
        };

        const events: (keyof WindowEventMap)[] = ['pointerdown', 'touchstart', 'keydown'];
        events.forEach((event) => window.addEventListener(event, reset));
        reset();

        return () => {
            events.forEach((event) => window.removeEventListener(event, reset));
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [onIdle, timeoutMs, active]);
}
