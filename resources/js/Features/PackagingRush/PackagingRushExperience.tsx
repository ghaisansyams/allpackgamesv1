import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import GameResultPopup from '@/Components/Kiosk/GameResultPopup';
import { RushLogo } from '@/Components/Kiosk/GameLogos';
import { PACKAGING_IMAGES, type PackagingImage } from '@/lib/packagingImages';
import { MiniGameApi } from '@/lib/api';

const TIME_LIMIT = 45;
const WIN_SCORE = 6;
const OPTIONS_PER_ROUND = 4;

function shuffled<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function newRound(): { options: PackagingImage[]; target: PackagingImage } {
    const options = shuffled(PACKAGING_IMAGES).slice(0, OPTIONS_PER_ROUND);
    const target = options[Math.floor(Math.random() * options.length)];
    return { options, target };
}

export default function PackagingRushExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [round, setRound] = useState(() => newRound());
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [lastTapped, setLastTapped] = useState<string | null>(null);
    const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
    const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
    const [attempt, setAttempt] = useState(0);
    const startedAt = useRef(Date.now());
    const finished = useRef(false);

    function finish(result: 'win' | 'lose') {
        if (finished.current) return;
        finished.current = true;
        setOutcome(result);
        MiniGameApi.record('packaging_rush', result === 'win', visitorId, {
            score,
            misses,
            seconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
    }

    function pick(image: PackagingImage) {
        if (outcome || flash) return;
        setLastTapped(image.src);

        if (image.src === round.target.src) {
            setFlash('correct');
            const nextScore = score + 1;
            setScore(nextScore);
            window.setTimeout(() => {
                setFlash(null);
                if (nextScore >= WIN_SCORE) {
                    finish('win');
                } else {
                    setRound(newRound());
                }
            }, 350);
        } else {
            setFlash('wrong');
            setMisses((m) => m + 1);
            window.setTimeout(() => setFlash(null), 350);
        }
    }

    function playAgain() {
        setRound(newRound());
        setScore(0);
        setMisses(0);
        setLastTapped(null);
        setFlash(null);
        setOutcome(null);
        startedAt.current = Date.now();
        finished.current = false;
        setAttempt((a) => a + 1);
    }

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-300 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <RushLogo className="mb-2 h-20 w-20" />
            <h2 className="mb-1 font-display text-3xl font-black uppercase text-white">Packaging Rush</h2>
            <p className="mb-4 text-slate-300">Tap the matching packaging before time runs out!</p>

            {outcome === null && (
                <CountdownBar key={attempt} totalSeconds={TIME_LIMIT} dangerSeconds={10} onExpire={() => finish('lose')} />
            )}

            <p className="mb-5 font-display text-sm font-semibold text-amber-400">
                Score: {score} / {WIN_SCORE}
            </p>

            <div className="mb-6 flex flex-col items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Find this one</span>
                <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    <img src={round.target.src} alt={round.target.label} className="h-full w-full object-cover" />
                </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
                {round.options.map((image) => {
                    const isTapped = lastTapped === image.src;
                    const ring =
                        flash && isTapped
                            ? flash === 'correct'
                                ? 'border-emerald-400 ring-4 ring-emerald-400/50'
                                : 'border-red-500 ring-4 ring-red-500/50'
                            : 'border-amber-300/30';
                    return (
                        <button
                            key={image.src}
                            onClick={() => pick(image)}
                            disabled={outcome !== null || flash !== null}
                            className={`aspect-square overflow-hidden rounded-2xl border-2 shadow-lg transition active:scale-95 ${ring}`}
                        >
                            <img src={image.src} alt={image.label} className="h-full w-full object-cover" />
                        </button>
                    );
                })}
            </div>

            {outcome && (
                <GameResultPopup
                    won={outcome === 'win'}
                    title={outcome === 'win' ? 'Rush Complete!' : "Time's Up!"}
                    onPlayAgain={playAgain}
                    onDone={onBack}
                >
                    <p>
                        {outcome === 'win'
                            ? `You matched ${score} packaging items in time!`
                            : `You scored ${score} — so close, want another shot?`}
                    </p>
                </GameResultPopup>
            )}
        </div>
    );
}
