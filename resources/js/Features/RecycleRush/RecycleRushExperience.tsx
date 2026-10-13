import { DragEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import GameResultPopup from '@/Components/Kiosk/GameResultPopup';
import { RecycleLogo } from '@/Components/Kiosk/GameLogos';
import { PACKAGING_IMAGES, type PackagingImage, type WasteCategory } from '@/lib/packagingImages';
import { MiniGameApi } from '@/lib/api';

const TIME_LIMIT = 45;
const WIN_SCORE = 6;

const BINS: { category: WasteCategory; label: string; color: string }[] = [
    { category: 'recyclable', label: 'Recyclable', color: 'from-sky-600 to-sky-800 border-sky-400/50' },
    { category: 'compostable', label: 'Compostable', color: 'from-emerald-600 to-emerald-800 border-emerald-400/50' },
    { category: 'general', label: 'General Waste', color: 'from-slate-600 to-slate-800 border-slate-400/50' },
];

function shuffled<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function RecycleRushExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [queue, setQueue] = useState<PackagingImage[]>(() => shuffled(PACKAGING_IMAGES));
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [flashBin, setFlashBin] = useState<{ category: WasteCategory; correct: boolean } | null>(null);
    const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
    const [attempt, setAttempt] = useState(0);
    const startedAt = useRef(Date.now());
    const finished = useRef(false);

    // Same reasoning as Memory Match: fetch every image up front so the round-to-round
    // swaps are instant instead of waiting on a network fetch each time.
    useEffect(() => {
        PACKAGING_IMAGES.forEach((image) => {
            const img = new Image();
            img.src = image.src;
        });
    }, []);

    const current = queue[0];

    function finish(result: 'win' | 'lose') {
        if (finished.current) return;
        finished.current = true;
        setOutcome(result);
        MiniGameApi.record('recycle_rush', result === 'win', visitorId, {
            score,
            misses,
            seconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
    }

    function sort(category: WasteCategory) {
        if (outcome || flashBin || !current) return;
        const correct = current.category === category;
        const nextScore = correct ? score + 1 : score;

        setFlashBin({ category, correct });
        if (correct) {
            setScore(nextScore);
        } else {
            setMisses((m) => m + 1);
        }

        window.setTimeout(() => {
            setFlashBin(null);
            if (correct && nextScore >= WIN_SCORE) {
                finish('win');
                return;
            }
            setQueue((prev) => {
                const rest = prev.slice(1);
                return rest.length > 0 ? rest : shuffled(PACKAGING_IMAGES);
            });
        }, 350);
    }

    // Dragging the item onto a bin works the same as tapping that bin — the payload itself
    // doesn't matter, only which bin received the drop.
    function handleDragStart(e: DragEvent<HTMLDivElement>) {
        e.dataTransfer.setData('text/plain', 'packaging-item');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDrop(e: DragEvent<HTMLButtonElement>, category: WasteCategory) {
        e.preventDefault();
        sort(category);
    }

    function playAgain() {
        setQueue(shuffled(PACKAGING_IMAGES));
        setScore(0);
        setMisses(0);
        setFlashBin(null);
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

            <RecycleLogo className="mb-2 h-20 w-20" />
            <h2 className="mb-1 font-display text-3xl font-black uppercase text-white">Recycle Rush</h2>
            <p className="mb-4 text-center text-slate-300">Drag or tap each pack into the right bin before time runs out!</p>

            {outcome === null && (
                <CountdownBar key={attempt} totalSeconds={TIME_LIMIT} dangerSeconds={10} onExpire={() => finish('lose')} />
            )}

            <p className="mb-6 font-display text-sm font-semibold text-amber-400">
                Score: {score} / {WIN_SCORE}
            </p>

            {current && (
                <div
                    draggable
                    onDragStart={handleDragStart}
                    className="mb-8 h-32 w-32 cursor-grab overflow-hidden rounded-2xl border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.4)] active:cursor-grabbing"
                >
                    <img src={current.src} alt={current.label} className="pointer-events-none h-full w-full object-cover" />
                </div>
            )}

            <div className="grid w-full grid-cols-3 gap-3">
                {BINS.map((bin) => {
                    const isFlashed = flashBin?.category === bin.category;
                    return (
                        <button
                            key={bin.category}
                            onClick={() => sort(bin.category)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, bin.category)}
                            disabled={outcome !== null || flashBin !== null}
                            className={`flex min-h-[110px] flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-gradient-to-b p-3 text-center shadow-lg transition active:scale-95 ${bin.color} ${
                                isFlashed ? (flashBin!.correct ? 'ring-4 ring-emerald-300' : 'ring-4 ring-red-400') : ''
                            }`}
                        >
                            <span className="font-display text-xs font-black uppercase leading-tight text-white">{bin.label}</span>
                        </button>
                    );
                })}
            </div>

            {outcome && (
                <GameResultPopup
                    won={outcome === 'win'}
                    title={outcome === 'win' ? 'Sorted Like a Pro!' : "Time's Up!"}
                    onPlayAgain={playAgain}
                    onDone={onBack}
                >
                    <p>
                        {outcome === 'win'
                            ? `You sorted ${score} packs correctly in time!`
                            : `You sorted ${score} — so close, want another shot?`}
                    </p>
                </GameResultPopup>
            )}
        </div>
    );
}
