import { useEffect, useState } from 'react';

/**
 * Persistent countdown from `totalSeconds`, turning red once `dangerSeconds` remain.
 * Starts counting the moment it mounts and keeps running across stage changes as long
 * as the parent keeps it mounted (it is not reset between Decision Lab stages).
 */
export default function CountdownBar({
    totalSeconds = 180,
    dangerSeconds = 25,
}: {
    totalSeconds?: number;
    dangerSeconds?: number;
}) {
    const [remaining, setRemaining] = useState(totalSeconds);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRemaining((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => window.clearInterval(interval);
    }, []);

    const percent = Math.max(0, (remaining / totalSeconds) * 100);
    const danger = remaining <= dangerSeconds;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return (
        <div className="mx-auto mb-6 w-full max-w-3xl">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                <span className="uppercase tracking-widest text-slate-500">Time Remaining</span>
                <span className={danger ? 'animate-pulse text-red-600' : 'text-slate-600'}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                        danger ? 'bg-red-600' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
