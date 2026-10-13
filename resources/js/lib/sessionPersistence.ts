/**
 * Survives an accidental page refresh mid-flow without leaking a stranger's half-finished
 * form to the next visitor: sessionStorage clears itself when the kiosk browser tab closes
 * or restarts, and callers are expected to clear the key explicitly on deliberate exits
 * (back button, finishing the flow, idle timeout) so the next visitor starts clean.
 */
export function savePersistedState<T>(key: string, value: T): void {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Private browsing / storage disabled — the experience still works, it just won't
        // survive a refresh.
    }
}

export function loadPersistedState<T>(key: string): T | null {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

export function clearPersistedState(key: string): void {
    try {
        sessionStorage.removeItem(key);
    } catch {
        // Nothing to clean up if storage was never writable.
    }
}
