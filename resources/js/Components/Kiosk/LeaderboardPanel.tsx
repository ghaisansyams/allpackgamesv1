import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { LeaderboardApi, type LeaderboardEntry, type LeaderboardGame } from '@/lib/api';

/**
 * Shown on the idle screen to give passersby something to watch while the booth waits for
 * its next player — a top score per game gives them a concrete record to beat. Polls rather
 * than using Echo since it only needs to be roughly fresh, not instant.
 */
export default function LeaderboardPanel() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [showFull, setShowFull] = useState(false);

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
        <>
            <div className="mt-6 w-full max-w-sm rounded-2xl border border-amber-400/20 bg-white/[0.05] p-4 shadow-xl backdrop-blur-xl">
                <p className="mb-3 flex items-center justify-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-amber-400">
                    <Trophy className="h-3.5 w-3.5" /> Top Scores
                </p>
                <ul className="space-y-3 text-left">
                    {entries.map((entry, i) => (
                        <li key={i}>
                            <p className="text-left text-[11px] uppercase tracking-wide text-slate-400">{entry.game}</p>
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="truncate font-semibold text-white">{entry.name}</span>
                                <span className="shrink-0 font-display font-black text-amber-400">{entry.score}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => setShowFull(true)}
                    className="mt-3 w-full text-center text-xs font-semibold text-amber-400/80 underline hover:text-amber-300"
                >
                    Show More
                </button>
            </div>

            {showFull && <FullLeaderboardPopup onClose={() => setShowFull(false)} />}
        </>
    );
}

function FullLeaderboardPopup({ onClose }: { onClose: () => void }) {
    const [games, setGames] = useState<LeaderboardGame[] | null>(null);

    useEffect(() => {
        LeaderboardApi.full()
            .then(setGames)
            .catch(() => setGames([]));
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
            <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#1a1430] to-[#0f0a1f] p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-display text-xl font-black uppercase text-white">
                        <Trophy className="h-5 w-5 text-amber-400" /> Top Scores
                    </h2>
                    <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {games === null && <p className="py-6 text-center text-slate-400">Loading…</p>}
                {games?.length === 0 && <p className="py-6 text-center text-slate-400">No scores yet — be the first!</p>}

                <div className="space-y-5">
                    {games?.map((game) => (
                        <div key={game.game}>
                            <p className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-amber-400">{game.game}</p>
                            <ol className="space-y-1.5">
                                {game.entries.map((entry, i) => (
                                    <li key={i} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                                        <span className="flex min-w-0 items-center gap-2">
                                            <span className="shrink-0 font-display font-black text-slate-500">#{i + 1}</span>
                                            <span className="truncate font-semibold text-white">{entry.name}</span>
                                        </span>
                                        <span className="shrink-0 font-display font-black text-amber-400">{entry.score}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
