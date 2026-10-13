import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Coffee, Cookie, Utensils, Droplet, Pill, Sparkles, LucideIcon } from 'lucide-react';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import GameResultPopup from '@/Components/Kiosk/GameResultPopup';
import Mascot from '@/Components/Kiosk/Mascot';
import { MiniGameApi } from '@/lib/api';

const ICONS: LucideIcon[] = [Coffee, Cookie, Utensils, Droplet, Pill, Sparkles];
const TIME_LIMIT = 60;

interface CardState {
    key: number;
    iconIndex: number;
    flipped: boolean;
    matched: boolean;
}

function shuffledCards(): CardState[] {
    const pairs = [...ICONS.keys(), ...ICONS.keys()];
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs.map((iconIndex, key) => ({ key, iconIndex, flipped: false, matched: false }));
}

export default function MemoryCardExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [cards, setCards] = useState<CardState[]>(() => shuffledCards());
    const [selected, setSelected] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [locked, setLocked] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
    const [round, setRound] = useState(0);
    const startedAt = useRef(Date.now());

    const matchedCount = cards.filter((c) => c.matched).length;

    useEffect(() => {
        if (matchedCount === cards.length && outcome === null) {
            finish('win');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchedCount]);

    function finish(result: 'win' | 'lose') {
        setOutcome(result);
        MiniGameApi.record('memory_card', result === 'win', visitorId, {
            moves,
            seconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
    }

    function flipCard(key: number) {
        if (locked || outcome) return;
        const card = cards.find((c) => c.key === key);
        if (!card || card.flipped || card.matched) return;

        const nextSelected = [...selected, key];
        setCards((prev) => prev.map((c) => (c.key === key ? { ...c, flipped: true } : c)));
        setSelected(nextSelected);

        if (nextSelected.length === 2) {
            setMoves((m) => m + 1);
            const [a, b] = nextSelected;
            const cardA = cards.find((c) => c.key === a)!;
            const cardB = cards.find((c) => c.key === b)!;

            if (cardA.iconIndex === cardB.iconIndex) {
                setCards((prev) => prev.map((c) => (c.key === a || c.key === b ? { ...c, matched: true } : c)));
                setSelected([]);
            } else {
                setLocked(true);
                window.setTimeout(() => {
                    setCards((prev) => prev.map((c) => (c.key === a || c.key === b ? { ...c, flipped: false } : c)));
                    setSelected([]);
                    setLocked(false);
                }, 800);
            }
        }
    }

    function playAgain() {
        setCards(shuffledCards());
        setSelected([]);
        setMoves(0);
        setLocked(false);
        setOutcome(null);
        startedAt.current = Date.now();
        setRound((r) => r + 1);
    }

    return (
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <Mascot pose="point" className="mb-2 h-20" />
            <h2 className="mb-1 text-3xl font-black text-slate-900">Memory Match</h2>
            <p className="mb-4 text-slate-600">Find all 6 packaging pairs before time runs out!</p>

            {outcome === null && <CountdownBar key={round} totalSeconds={TIME_LIMIT} dangerSeconds={15} onExpire={() => finish('lose')} />}

            <p className="mb-4 text-sm font-semibold text-slate-500">Moves: {moves}</p>

            <div className="grid w-full grid-cols-4 gap-3">
                {cards.map((card) => {
                    const Icon = ICONS[card.iconIndex];
                    const revealed = card.flipped || card.matched;
                    return (
                        <button
                            key={card.key}
                            onClick={() => flipCard(card.key)}
                            disabled={revealed}
                            className={`flex aspect-square items-center justify-center rounded-2xl text-2xl font-black shadow transition active:scale-95 ${
                                card.matched
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : revealed
                                      ? 'bg-white text-indigo-700'
                                      : 'bg-gradient-to-br from-indigo-600 to-purple-700'
                            }`}
                        >
                            {revealed && <Icon className="h-8 w-8" />}
                        </button>
                    );
                })}
            </div>

            {outcome && (
                <GameResultPopup
                    won={outcome === 'win'}
                    title={outcome === 'win' ? 'All Matched!' : "Time's Up!"}
                    onPlayAgain={playAgain}
                    onDone={onBack}
                >
                    <p>{outcome === 'win' ? `You matched all pairs in ${moves} moves.` : 'So close — want another shot?'}</p>
                </GameResultPopup>
            )}
        </div>
    );
}
