import { useCallback, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Disc3, Target, Grid3x3, Puzzle, Timer } from 'lucide-react';
import QrCodeImage from '@/Components/Kiosk/QrCodeImage';
import Mascot from '@/Components/Kiosk/Mascot';
import { useBoothSession } from '@/lib/useBoothSession';
import { useIdleReset } from '@/lib/useIdleReset';
import WheelExperience from '@/Features/Wheel/WheelExperience';
import DecisionLabExperience from '@/Features/DecisionLab/DecisionLabExperience';
import MemoryCardExperience from '@/Features/MemoryCard/MemoryCardExperience';
import PuzzleExperience from '@/Features/Puzzle/PuzzleExperience';
import StopwatchExperience from '@/Features/Stopwatch/StopwatchExperience';

type Screen = 'idle' | 'choose' | 'wheel' | 'decision_lab' | 'memory' | 'puzzle' | 'stopwatch';

const GAMES: { screen: Screen; title: string; tagline: string; icon: typeof Disc3; color: string }[] = [
    { screen: 'wheel', title: 'Spin the Wheel', tagline: 'SPIN. PLAY. PACK. WIN!', icon: Disc3, color: 'from-purple-600 to-indigo-700' },
    { screen: 'decision_lab', title: 'Decision Lab', tagline: 'Can you pick the right pack?', icon: Target, color: 'from-emerald-600 to-teal-700' },
    { screen: 'memory', title: 'Memory Match', tagline: 'Find the matching pairs', icon: Grid3x3, color: 'from-amber-500 to-orange-600' },
    { screen: 'puzzle', title: 'Packaging Puzzle', tagline: 'Slide it back together', icon: Puzzle, color: 'from-sky-500 to-blue-700' },
    { screen: 'stopwatch', title: 'Stop at 10.00', tagline: 'Precision wins the prize', icon: Timer, color: 'from-rose-500 to-pink-700' },
];

export default function Hub() {
    const [screen, setScreen] = useState<Screen>('idle');
    const [visitorId, setVisitorId] = useState<number | null>(null);

    const { token, visitorId: joinedVisitorId } = useBoothSession(screen === 'idle');

    useEffect(() => {
        if (joinedVisitorId) {
            setVisitorId(joinedVisitorId);
            setScreen('choose');
        }
    }, [joinedVisitorId]);

    const goToChoose = useCallback(() => setScreen('choose'), []);
    const resetToIdle = useCallback(() => {
        setVisitorId(null);
        setScreen('idle');
    }, []);

    // An abandoned session (visitor walked off mid-game) shouldn't block the booth for the
    // next person — bounce back to the QR screen after a stretch of no touch activity.
    useIdleReset(resetToIdle, 90_000, screen !== 'idle');

    const joinUrl = token ? `${window.location.origin}/join/${token}` : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
            <Head title="ALLPACK 2026 — Interactive Experience Hub" />

            {screen === 'idle' && (
                <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                        ALLPACK 2026 · Interactive Experience Hub
                    </p>
                    <Mascot pose="wave" className="h-36" />
                    <h1 className="text-4xl font-black leading-tight text-white">
                        GROWING OUR
                        <br />
                        TOMORROW
                    </h1>

                    <div className="rounded-3xl bg-white p-4 shadow-2xl">
                        {token ? <QrCodeImage value={joinUrl} /> : <div className="h-56 w-56 animate-pulse rounded-2xl bg-slate-200" />}
                    </div>

                    <div>
                        <p className="text-lg font-bold text-amber-400">Scan to Play</p>
                        <p className="max-w-xs text-sm text-slate-300">
                            Point your phone camera at the QR code, fill in your details, then look back here.
                        </p>
                    </div>
                </div>
            )}

            {screen === 'choose' && (
                <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-10 text-center">
                    <Mascot pose="point" className="h-24" />
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                            Choose Your Game
                        </p>
                        <h1 className="text-3xl font-black text-white">5 Ways to Play ALLPACK</h1>
                    </div>
                    <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
                        {GAMES.map((game) => (
                            <GameCard key={game.screen} game={game} onClick={() => setScreen(game.screen)} />
                        ))}
                    </div>
                    <button onClick={resetToIdle} className="mt-2 text-sm text-slate-400 underline">
                        I'm Done — Next Guest
                    </button>
                </div>
            )}

            {screen !== 'idle' && screen !== 'choose' && (
                <div className="min-h-screen bg-slate-50">
                    {screen === 'wheel' && (
                        <WheelExperience visitorId={visitorId} onExit={resetToIdle} onBack={goToChoose} onGoToDecisionLab={() => setScreen('decision_lab')} />
                    )}
                    {screen === 'decision_lab' && (
                        <DecisionLabExperience visitorId={visitorId} onExit={resetToIdle} onBack={goToChoose} />
                    )}
                    {screen === 'memory' && <MemoryCardExperience visitorId={visitorId} onBack={goToChoose} />}
                    {screen === 'puzzle' && <PuzzleExperience visitorId={visitorId} onBack={goToChoose} />}
                    {screen === 'stopwatch' && <StopwatchExperience visitorId={visitorId} onBack={goToChoose} />}
                </div>
            )}
        </div>
    );
}

function GameCard({
    game,
    onClick,
}: {
    game: { title: string; tagline: string; icon: typeof Disc3; color: string };
    onClick: () => void;
}) {
    const GameIcon = game.icon;
    return (
        <button
            onClick={onClick}
            className={`flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br ${game.color} p-6 text-center shadow-2xl transition active:scale-95`}
        >
            <GameIcon className="h-9 w-9 text-white" />
            <span className="text-lg font-black text-white">{game.title}</span>
            <span className="text-xs text-white/80">{game.tagline}</span>
        </button>
    );
}
