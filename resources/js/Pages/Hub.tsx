import { useCallback, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import QrCodeImage from '@/Components/Kiosk/QrCodeImage';
import TouchButton from '@/Components/Kiosk/TouchButton';
import CosmicBackground from '@/Components/Kiosk/CosmicBackground';
import LeaderboardPanel from '@/Components/Kiosk/LeaderboardPanel';
import { WheelLogo, DecisionLogo, MemoryLogo, PuzzleLogo, StopwatchLogo, SpotMissingLogo } from '@/Components/Kiosk/GameLogos';
import { useBoothSession } from '@/lib/useBoothSession';
import { useIdleReset } from '@/lib/useIdleReset';
import WheelExperience from '@/Features/Wheel/WheelExperience';
import DecisionLabExperience from '@/Features/DecisionLab/DecisionLabExperience';
import MemoryCardExperience from '@/Features/MemoryCard/MemoryCardExperience';
import PuzzleExperience from '@/Features/Puzzle/PuzzleExperience';
import StopwatchExperience from '@/Features/Stopwatch/StopwatchExperience';
import SpotMissingExperience from '@/Features/SpotMissing/SpotMissingExperience';
import type { DecisionResult } from '@/types/content';

type Screen = 'idle' | 'choose' | 'wheel' | 'decision_lab' | 'memory' | 'puzzle' | 'stopwatch' | 'spot_missing' | 'summary';

type StopwatchBest = { elapsed: number; won: boolean };

// Visitors scan this to fill their details on their own phone, then get bounced back here
// automatically — needs two requests (booth creates the session, phone claims it) to land on
// the same backend state, which real booth hardware (one machine, one SQLite file) guarantees
// but an ephemeral container deployment (e.g. the Vercel demo build) does not: a recycled
// instance can lose the session between those two requests. Baked off there via
// VITE_QR_JOIN_ENABLED=false at build time; defaults on everywhere else.
const QR_JOIN_ENABLED = import.meta.env.VITE_QR_JOIN_ENABLED !== 'false';

type LogoComponent = (props: { className?: string }) => JSX.Element;

const GAMES: { screen: Screen; title: string; tagline: string; Logo: LogoComponent }[] = [
    { screen: 'wheel', title: 'Spin the Wheel', tagline: 'SPIN. PLAY. PACK. WIN!', Logo: WheelLogo },
    { screen: 'decision_lab', title: 'Decision Lab', tagline: 'Can you pick the right pack?', Logo: DecisionLogo },
    { screen: 'memory', title: 'Memory Match', tagline: 'Find the matching pairs', Logo: MemoryLogo },
    { screen: 'puzzle', title: 'Packaging Puzzle', tagline: 'Slide it back together', Logo: PuzzleLogo },
    { screen: 'stopwatch', title: 'Stop at 10.00', tagline: 'Precision wins the prize', Logo: StopwatchLogo },
    { screen: 'spot_missing', title: "What's Missing?", tagline: 'Spot the vanished product', Logo: SpotMissingLogo },
];

export default function Hub() {
    const [screen, setScreen] = useState<Screen>('idle');
    const [visitorId, setVisitorId] = useState<number | null>(null);

    // Best result per game played this visit, surfaced on the end-of-visit summary screen
    // instead of a mid-game popup — only the games actually played show up there.
    const [stopwatchBest, setStopwatchBest] = useState<StopwatchBest | null>(null);
    const [decisionLabResult, setDecisionLabResult] = useState<DecisionResult | null>(null);

    const { token, visitorId: joinedVisitorId } = useBoothSession(QR_JOIN_ENABLED && screen === 'idle');

    useEffect(() => {
        if (joinedVisitorId) {
            setVisitorId(joinedVisitorId);
            setScreen('choose');
        }
    }, [joinedVisitorId]);

    const goToChoose = useCallback(() => setScreen('choose'), []);
    const resetToIdle = useCallback(() => {
        setVisitorId(null);
        setStopwatchBest(null);
        setDecisionLabResult(null);
        setScreen('idle');
    }, []);

    const finishVisit = useCallback(() => {
        if (stopwatchBest || decisionLabResult) {
            setScreen('summary');
        } else {
            resetToIdle();
        }
    }, [stopwatchBest, decisionLabResult, resetToIdle]);

    const recordStopwatchAttempt = useCallback((attempt: StopwatchBest) => {
        setStopwatchBest((prev) => (prev && Math.abs(prev.elapsed - 10) <= Math.abs(attempt.elapsed - 10) ? prev : attempt));
    }, []);

    // An abandoned session (visitor walked off mid-game) shouldn't block the booth for the
    // next person — bounce back to the QR screen after a stretch of no touch activity.
    useIdleReset(resetToIdle, 90_000, screen !== 'idle');

    const joinUrl = token ? `${window.location.origin}/join/${token}` : '';

    return (
        <CosmicBackground>
            <Head title="ALLPACK 2026 — Interactive Experience Hub" />

            {screen === 'idle' && QR_JOIN_ENABLED && (
                <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10 text-center">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                        ALLPACK 2026 · Interactive Experience Hub
                    </p>
                    <WheelLogo className="h-32 w-32" />
                    <h1 className="font-display text-5xl font-black uppercase leading-tight text-white drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                        GROWING OUR
                        <br />
                        <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                            TOMORROW
                        </span>
                    </h1>

                    <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                        {token ? <QrCodeImage value={joinUrl} /> : <div className="h-56 w-56 animate-pulse rounded-2xl bg-white/10" />}
                    </div>

                    <div>
                        <p className="font-display text-lg font-bold text-amber-400">Scan to Play</p>
                        <p className="max-w-xs text-sm text-slate-300">
                            Point your phone camera at the QR code, fill in your details, then look back here.
                        </p>
                    </div>

                    {/* For visitors already in the company's own customer database who'd rather
                        not re-enter their details here — goes straight to the games, no
                        visitor record attached (so results won't show up under their name on
                        the leaderboard). */}
                    <button onClick={goToChoose} className="text-sm text-slate-400 underline hover:text-slate-200">
                        Already a customer? Skip and play
                    </button>

                    <LeaderboardPanel />
                </div>
            )}

            {screen === 'idle' && !QR_JOIN_ENABLED && (
                <button
                    onClick={goToChoose}
                    className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 py-10 text-center"
                >
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                        ALLPACK 2026 · Interactive Experience Hub
                    </p>
                    <WheelLogo className="h-32 w-32" />
                    <h1 className="font-display text-5xl font-black uppercase leading-tight text-white drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                        GROWING OUR
                        <br />
                        <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                            TOMORROW
                        </span>
                    </h1>
                    <span className="mt-4 animate-pulse rounded-full border border-amber-200/50 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 px-10 py-4 font-display text-xl font-bold uppercase tracking-wide text-amber-950 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                        Tap to Start
                    </span>
                </button>
            )}

            {screen === 'choose' && (
                <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-10 text-center">
                    <div className="pt-6">
                        <p className="font-display mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                            Choose Your Game
                        </p>
                        <h1 className="font-display text-3xl font-black uppercase text-white">{GAMES.length} Ways to Play ALLPACK</h1>
                    </div>
                    <div className="flex w-full max-w-md flex-wrap justify-center gap-4">
                        {GAMES.map((game) => (
                            <GameCard key={game.screen} game={game} onClick={() => setScreen(game.screen)} />
                        ))}
                    </div>
                    <button onClick={finishVisit} className="mt-2 text-sm text-slate-400 underline">
                        I'm Done — Next Guest
                    </button>
                </div>
            )}

            {screen === 'summary' && (
                <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10 text-center">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Your Results</p>
                    <h1 className="font-display text-3xl font-black uppercase text-white">Great Playing With Us!</h1>

                    <div className="flex w-full max-w-md flex-col gap-4">
                        {decisionLabResult && (
                            <div className="rounded-3xl border border-amber-400/20 bg-white/[0.06] p-6 text-left shadow-2xl backdrop-blur-xl">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Decision Lab</p>
                                <p className="mt-1 font-display text-4xl font-black text-amber-400">
                                    {decisionLabResult.fit_score}
                                    <span className="text-lg text-slate-400"> / 100</span>
                                </p>
                                <p className="text-sm text-slate-300">{decisionLabResult.solution_label}</p>
                            </div>
                        )}

                        {stopwatchBest && (
                            <div className="rounded-3xl border border-amber-400/20 bg-white/[0.06] p-6 text-left shadow-2xl backdrop-blur-xl">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Stop at 10.00 — Best Try</p>
                                <p className="mt-1 font-display text-4xl font-black text-amber-400">{stopwatchBest.elapsed.toFixed(2)}s</p>
                                <p className="text-sm text-slate-300">
                                    {stopwatchBest.won ? 'Perfect timing!' : `${Math.abs(stopwatchBest.elapsed - 10).toFixed(2)}s off target`}
                                </p>
                            </div>
                        )}
                    </div>

                    <TouchButton onClick={resetToIdle}>Selesai — Tamu Berikutnya</TouchButton>
                </div>
            )}

            {screen !== 'idle' && screen !== 'choose' && screen !== 'summary' && (
                <>
                    {screen === 'wheel' && (
                        <WheelExperience visitorId={visitorId} onBack={goToChoose} onGoToDecisionLab={() => setScreen('decision_lab')} />
                    )}
                    {screen === 'decision_lab' && (
                        <DecisionLabExperience visitorId={visitorId} onBack={goToChoose} onResult={setDecisionLabResult} />
                    )}
                    {screen === 'memory' && <MemoryCardExperience visitorId={visitorId} onBack={goToChoose} />}
                    {screen === 'puzzle' && <PuzzleExperience visitorId={visitorId} onBack={goToChoose} />}
                    {screen === 'stopwatch' && (
                        <StopwatchExperience visitorId={visitorId} onBack={goToChoose} onResult={recordStopwatchAttempt} />
                    )}
                    {screen === 'spot_missing' && <SpotMissingExperience visitorId={visitorId} onBack={goToChoose} />}
                </>
            )}
        </CosmicBackground>
    );
}

function GameCard({
    game,
    onClick,
}: {
    game: { title: string; tagline: string; Logo: LogoComponent };
    onClick: () => void;
}) {
    const { Logo } = game;
    return (
        <button
            onClick={onClick}
            className="group flex min-h-[170px] w-[47%] min-w-[150px] flex-col items-center justify-center gap-2 rounded-3xl border border-amber-400/20 bg-white/[0.06] p-5 text-center shadow-2xl backdrop-blur-xl transition hover:border-amber-400/60 hover:bg-white/[0.1] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] active:scale-95"
        >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-400/15 to-red-600/15">
                <Logo className="h-10 w-10" />
            </span>
            <span className="font-display text-base font-black uppercase leading-tight text-white">{game.title}</span>
            <span className="text-xs text-slate-300">{game.tagline}</span>
        </button>
    );
}
