import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import { StopwatchLogo } from '@/Components/Kiosk/GameLogos';
import { MiniGameApi } from '@/lib/api';

const TARGET_SECONDS = 10;
const WIN_TOLERANCE = 0.15;

type Phase = 'idle' | 'running' | 'result';

export default function StopwatchExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [elapsed, setElapsed] = useState(0);
    const [finalElapsed, setFinalElapsed] = useState<number | null>(null);
    const startRef = useRef(0);
    const frameRef = useRef<number>();

    useEffect(() => {
        if (phase !== 'running') return;

        const tick = () => {
            setElapsed((performance.now() - startRef.current) / 1000);
            frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [phase]);

    function start() {
        startRef.current = performance.now();
        setElapsed(0);
        setPhase('running');
    }

    function stop() {
        const final = (performance.now() - startRef.current) / 1000;
        setFinalElapsed(final);
        setPhase('result');

        const won = Math.abs(final - TARGET_SECONDS) <= WIN_TOLERANCE;
        MiniGameApi.record('stopwatch', won, visitorId, { stopped_at: Number(final.toFixed(3)) });
    }

    function playAgain() {
        setFinalElapsed(null);
        setElapsed(0);
        setPhase('idle');
    }

    const won = finalElapsed !== null && Math.abs(finalElapsed - TARGET_SECONDS) <= WIN_TOLERANCE;
    const diff = finalElapsed !== null ? Math.abs(finalElapsed - TARGET_SECONDS) : null;

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-300 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <StopwatchLogo className={`mb-2 h-20 w-20 ${phase === 'running' ? 'animate-pulse' : ''}`} />
            <h2 className="mb-1 font-display text-3xl font-black uppercase text-white">Stop at 10.00</h2>
            <p className="mb-8 text-center text-slate-300">Tap Start, then Stop the clock as close to exactly 10.00 seconds as you can.</p>

            {/* The stopwatch face itself never leaves the screen, and never gets covered by a
                popup — the result is read straight off it, like a real stopwatch. */}
            <div className="mb-6 rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#1a1430] to-[#0f0a1f] px-10 py-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <span className="font-display text-6xl font-black tabular-nums text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                    {(phase === 'result' ? finalElapsed! : elapsed).toFixed(2)}
                </span>
                <span className="ml-1 text-2xl text-slate-400">s</span>
            </div>

            {phase === 'result' && (
                <p className="mb-6 text-center text-slate-300">
                    {won ? 'Perfect timing!' : finalElapsed! < TARGET_SECONDS ? 'A little too early' : 'A little too late'} —{' '}
                    {diff!.toFixed(2)}s off target.
                </p>
            )}

            {phase === 'idle' && <TouchButton onClick={start}>Start</TouchButton>}
            {phase === 'running' && (
                <TouchButton variant="secondary" onClick={stop}>
                    Stop!
                </TouchButton>
            )}
            {phase === 'result' && (
                <div className="flex flex-col items-center gap-3">
                    <TouchButton variant={won ? 'secondary' : 'ghost'} onClick={playAgain}>
                        Play Again
                    </TouchButton>
                    <button onClick={onBack} className="text-sm font-semibold text-slate-400 underline hover:text-white">
                        Back
                    </button>
                </div>
            )}
        </div>
    );
}
