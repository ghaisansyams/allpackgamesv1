import { DragEvent, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import GameResultPopup from '@/Components/Kiosk/GameResultPopup';
import TouchButton from '@/Components/Kiosk/TouchButton';
import { PuzzleLogo } from '@/Components/Kiosk/GameLogos';
import { generateJigsawTabs, jigsawPiecePath, shuffledPositions, type JigsawTabs } from '@/lib/jigsaw';
import { PACKAGING_IMAGES } from '@/lib/packagingImages';
import { MiniGameApi } from '@/lib/api';

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES: { key: Difficulty; label: string; grid: number; timeLimit: number }[] = [
    { key: 'easy', label: 'Easy', grid: 3, timeLimit: 90 },
    { key: 'medium', label: 'Medium', grid: 4, timeLimit: 150 },
    { key: 'hard', label: 'Hard', grid: 5, timeLimit: 240 },
];

const BOARD = 300;

export default function PuzzleExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [image, setImage] = useState(() => PACKAGING_IMAGES[Math.floor(Math.random() * PACKAGING_IMAGES.length)]);
    const [tabs, setTabs] = useState<JigsawTabs | null>(null);
    const [positions, setPositions] = useState<number[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
    const [round, setRound] = useState(0);
    const startedAt = useRef(Date.now());

    const config = difficulty ? DIFFICULTIES.find((d) => d.key === difficulty)! : null;
    const grid = config?.grid ?? 3;
    const pieceSize = BOARD / grid;
    const pad = pieceSize * 0.35;
    const cell = pieceSize + pad * 2;

    function startGame(d: Difficulty) {
        const cfg = DIFFICULTIES.find((x) => x.key === d)!;
        setDifficulty(d);
        setImage(PACKAGING_IMAGES[Math.floor(Math.random() * PACKAGING_IMAGES.length)]);
        setTabs(generateJigsawTabs(cfg.grid));
        setPositions(shuffledPositions(cfg.grid * cfg.grid));
        setSelected(null);
        setMoves(0);
        setOutcome(null);
        startedAt.current = Date.now();
        setRound((r) => r + 1);
    }

    function finish(result: 'win' | 'lose') {
        setOutcome(result);
        MiniGameApi.record('puzzle', result === 'win', visitorId, {
            moves,
            difficulty,
            seconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
    }

    function swap(a: number, b: number) {
        if (a === b || outcome) return;
        const next = [...positions];
        [next[a], next[b]] = [next[b], next[a]];
        setPositions(next);
        setSelected(null);
        setMoves((m) => m + 1);

        if (next.every((v, i) => v === i)) {
            finish('win');
        }
    }

    function tapSlot(slot: number) {
        if (outcome) return;
        if (selected === null) {
            setSelected(slot);
        } else if (selected === slot) {
            setSelected(null);
        } else {
            swap(selected, slot);
        }
    }

    function handleDragStart(e: DragEvent, slot: number) {
        e.dataTransfer.setData('text/plain', String(slot));
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDrop(e: DragEvent, slot: number) {
        e.preventDefault();
        const from = Number(e.dataTransfer.getData('text/plain'));
        if (!Number.isNaN(from)) swap(from, slot);
    }

    if (!difficulty || !config || !tabs) {
        return (
            <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-6 py-10">
                <button
                    onClick={onBack}
                    className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-300 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <PuzzleLogo className="mb-2 h-20 w-20" />
                <h2 className="mb-1 font-display text-3xl font-black uppercase text-white">Packaging Puzzle</h2>
                <p className="mb-8 text-center text-slate-300">Choose a difficulty to begin.</p>

                <div className="flex w-full max-w-xs flex-col gap-4">
                    {DIFFICULTIES.map((d) => (
                        <TouchButton key={d.key} onClick={() => startGame(d.key)}>
                            {d.label}
                            <span className="ml-2 text-sm font-normal normal-case opacity-70">
                                ({d.grid}×{d.grid})
                            </span>
                        </TouchButton>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-300 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <PuzzleLogo className="mb-2 h-20 w-20" />
            <h2 className="mb-1 font-display text-3xl font-black uppercase text-white">Packaging Puzzle</h2>
            <p className="mb-4 text-center text-slate-300">
                {DIFFICULTIES.find((d) => d.key === difficulty)!.label} — drag a piece onto another, or tap two to swap.
            </p>

            {outcome === null && (
                <CountdownBar key={round} totalSeconds={config.timeLimit} dangerSeconds={20} onExpire={() => finish('lose')} />
            )}

            <p className="mb-4 font-display text-sm font-semibold text-amber-400">Moves: {moves}</p>

            <div
                className="relative mx-auto mb-4"
                style={{ width: 'min(88vw, 360px)', aspectRatio: '1 / 1' }}
            >
                {positions.map((pieceIndex, slot) => {
                    const slotRow = Math.floor(slot / grid);
                    const slotCol = slot % grid;
                    const pieceRow = Math.floor(pieceIndex / grid);
                    const pieceCol = pieceIndex % grid;
                    const path = jigsawPiecePath(pieceRow, pieceCol, grid, pieceSize, pad, tabs);
                    const isSelected = selected === slot;
                    const isPlaced = pieceIndex === slot;

                    return (
                        <div
                            key={slot}
                            draggable
                            onDragStart={(e) => handleDragStart(e, slot)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, slot)}
                            onClick={() => tapSlot(slot)}
                            className="absolute cursor-pointer transition active:scale-95"
                            style={{
                                left: `${((slotCol * pieceSize - pad) / BOARD) * 100}%`,
                                top: `${((slotRow * pieceSize - pad) / BOARD) * 100}%`,
                                width: `${(cell / BOARD) * 100}%`,
                                height: `${(cell / BOARD) * 100}%`,
                                zIndex: isSelected ? 20 : 1,
                            }}
                        >
                            <svg viewBox={`0 0 ${cell} ${cell}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
                                <defs>
                                    <clipPath id={`clip-${slot}`}>
                                        <path d={path} />
                                    </clipPath>
                                </defs>
                                <g clipPath={`url(#clip-${slot})`}>
                                    <image
                                        href={image.src}
                                        x={-pieceCol * pieceSize + pad}
                                        y={-pieceRow * pieceSize + pad}
                                        width={grid * pieceSize}
                                        height={grid * pieceSize}
                                        preserveAspectRatio="xMidYMid slice"
                                    />
                                    {isPlaced && <rect x="0" y="0" width={cell} height={cell} fill="rgba(16,185,129,0.12)" />}
                                </g>
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={isSelected ? '#fde047' : 'rgba(253,230,138,0.55)'}
                                    strokeWidth={isSelected ? 3 : 1.5}
                                />
                            </svg>
                        </div>
                    );
                })}
            </div>

            {outcome && (
                <GameResultPopup
                    won={outcome === 'win'}
                    title={outcome === 'win' ? 'Solved It!' : "Time's Up!"}
                    onPlayAgain={() => startGame(difficulty)}
                    onDone={onBack}
                >
                    <p>{outcome === 'win' ? `You solved it in ${moves} moves.` : 'So close — want another shot?'}</p>
                </GameResultPopup>
            )}
        </div>
    );
}
