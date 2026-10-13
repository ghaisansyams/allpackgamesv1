import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardApi, type LeaderboardEntry } from '@/lib/api';

/**
 * Shown on the idle screen to give passersby something to watch while the booth waits for
 * its next player — recent winners create a bit of social proof/FOMO. Polls rather than
 * using Echo since it only needs to be roughly fresh, not instant.
 */
export default function LeaderboardPanel() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        let cancelled = false;

        function load() {
            LeaderboardApi.recent()
                .then((data) => {
                    if (!cancelled) setEntries(data);
                })
                .catch(() => {});
        }

        load();
        const interval = window.setInterval(load, 20_000);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, []);

    if (entries.length === 0) return null;

    return (
        <div className="mt-6 w-full max-w-xs rounded-2xl border border-amber-400/20 bg-white/[0.05] p-4 shadow-xl backdrop-blur-xl">
            <p className="mb-2 flex items-center justify-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-amber-400">
                <Trophy className="h-3.5 w-3.5" /> Recent Winners
            </p>
            <ul className="space-y-1.5">
                {entries.map((entry, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-semibold text-white">{entry.name}</span>
                        <span className="shrink-0 text-xs text-slate-400">{entry.game}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
