import { useEffect, useRef, useState } from 'react';
import { useEchoPublic } from '@laravel/echo-react';
import { BoothSessionApi } from '@/lib/api';

interface VisitorJoinedPayload {
    visitor_id: number;
    visitor_name: string;
}

/**
 * Creates a fresh booth session (shown as a QR code), then waits for the visitor to submit
 * their biodata on their own phone. Reverb delivers that instantly; a short poll runs
 * alongside it purely as a fallback in case the WebSocket connection drops — the booth must
 * never get stuck waiting just because Reverb hiccuped on venue WiFi.
 */
export function useBoothSession(active: boolean) {
    const [token, setToken] = useState<string | null>(null);
    const [visitorId, setVisitorId] = useState<number | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval>>();

    useEffect(() => {
        if (!active) {
            setToken(null);
            setVisitorId(null);
            return;
        }

        let cancelled = false;
        BoothSessionApi.create().then((newToken) => {
            if (!cancelled) setToken(newToken);
        });

        return () => {
            cancelled = true;
        };
    }, [active]);

    useEchoPublic<VisitorJoinedPayload>(
        token ? `booth-session.${token}` : '__none__',
        'visitor.joined',
        (payload) => setVisitorId(payload.visitor_id),
        [token],
    );

    useEffect(() => {
        if (!token || visitorId) {
            if (pollRef.current) clearInterval(pollRef.current);
            return;
        }

        pollRef.current = setInterval(() => {
            BoothSessionApi.status(token).then((status) => {
                if (status.visitor_id) {
                    setVisitorId(status.visitor_id);
                }
            });
        }, 3000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [token, visitorId]);

    return { token, visitorId, reset: () => setVisitorId(null) };
}
