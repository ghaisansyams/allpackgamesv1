import { useEffect, useState } from 'react';

/**
 * Persistent countdown from `totalSeconds`, turning red once `dangerSeconds` remain.
 * Starts counting the moment it mounts and keeps running across stage changes as long
 * as the parent keeps it mounted (it is not reset between Decision Lab stages).
 */
export default function CountdownBar({
    totalSeconds = 180,
    dangerSeconds = 25,
    onExpire,
}: {
    totalSeconds?: number;
    dangerSeconds?: number;
    onExpire?: () => void;
}) {
    const [remaining, setRemaining] = useState(totalSeconds);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    window.clearInterval(interval);
                    onExpire?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => window.clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const percent = Math.max(0, (remaining / totalSeconds) * 100);
    const danger = remaining <= dangerSeconds;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return (
        <div className="mx-auto mb-6 w-full max-w-3xl">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                <span className="uppercase tracking-widest text-slate-400">Time Remaining</span>
                <span className={`font-display tabular-nums ${danger ? 'animate-pulse text-red-400' : 'text-amber-300'}`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                        danger
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                            : 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    }`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
