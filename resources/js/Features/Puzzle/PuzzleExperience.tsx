import { DragEvent, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import GameResultPopup from '@/Components/Kiosk/GameResultPopup';
import { PuzzleLogo } from '@/Components/Kiosk/GameLogos';
import { MiniGameApi } from '@/lib/api';

const GRID = 3;
const EMPTY = GRID * GRID - 1;
const IMAGE = '/images/wheel/mystery-box.png';
const TIME_LIMIT = 90;
const SOLVED = Array.from({ length: GRID * GRID }, (_, i) => i);

function isAdjacent(a: number, b: number): boolean {
    const ar = Math.floor(a / GRID);
    const ac = a % GRID;
    const br = Math.floor(b / GRID);
    const bc = b % GRID;
    return (ar === br && Math.abs(ac - bc) === 1) || (ac === bc && Math.abs(ar - br) === 1);
}

/** Shuffles by performing valid random slides from the solved state, which always keeps the
 * puzzle solvable — unlike a raw random permutation, half of which are unsolvable. */
function shuffledTiles(): number[] {
    let tiles = [...SOLVED];
    let emptyPos = EMPTY;
    for (let i = 0; i < 120; i++) {
        const neighbors = tiles.map((_, idx) => idx).filter((idx) => isAdjacent(idx, emptyPos));
        const swapWith = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[emptyPos], tiles[swapWith]] = [tiles[swapWith], tiles[emptyPos]];
        emptyPos = swapWith;
    }
    return tiles;
}

export default function PuzzleExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [tiles, setTiles] = useState<number[]>(() => shuffledTiles());
    const [moves, setMoves] = useState(0);
    const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
    const [round, setRound] = useState(0);
    const startedAt = useRef(Date.now());

    function finish(result: 'win' | 'lose') {
        setOutcome(result);
        MiniGameApi.record('puzzle', result === 'win', visitorId, {
            moves,
            seconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
    }

    function tapTile(position: number) {
        if (outcome) return;
        const emptyPos = tiles.indexOf(EMPTY);
        if (!isAdjacent(position, emptyPos)) return;

        const next = [...tiles];
        [next[position], next[emptyPos]] = [next[emptyPos], next[position]];
        setTiles(next);
        setMoves((m) => m + 1);

        if (next.every((v, i) => v === SOLVED[i])) {
            finish('win');
        }
    }

    function playAgain() {
        setTiles(shuffledTiles());
        setMoves(0);
        setOutcome(null);
        startedAt.current = Date.now();
        setRound((r) => r + 1);
    }

    // Touch-screen visitors find dragging a tile into the gap more natural than tapping it —
    // this reuses tapTile()'s own adjacency check, so a drag from a non-adjacent tile is just
    // ignored rather than needing separate validation.
    function handleDragStart(e: DragEvent<HTMLButtonElement>, position: number) {
        e.dataTransfer.setData('text/plain', String(position));
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDropOnEmpty(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const dragged = Number(e.dataTransfer.getData('text/plain'));
        if (!Number.isNaN(dragged)) tapTile(dragged);
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
            <p className="mb-4 text-slate-300">Drag a tile into the gap, or tap it — whatever's easiest.</p>

            {outcome === null && <CountdownBar key={round} totalSeconds={TIME_LIMIT} dangerSeconds={20} onExpire={() => finish('lose')} />}

            <p className="mb-4 font-display text-sm font-semibold text-amber-400">Moves: {moves}</p>

            <div className="grid aspect-square w-full max-w-sm grid-cols-3 gap-1.5 rounded-2xl border border-amber-400/30 bg-white/[0.06] p-1.5 shadow-2xl backdrop-blur-xl">
                {tiles.map((value, position) => {
                    if (value === EMPTY) {
                        return (
                            <div
                                key={position}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDropOnEmpty}
                                className="rounded-xl border-2 border-dashed border-amber-300/20"
                            />
                        );
                    }
                    const col = value % GRID;
                    const row = Math.floor(value / GRID);
                    return (
                        <button
                            key={position}
                            draggable
                            onDragStart={(e) => handleDragStart(e, position)}
                            onClick={() => tapTile(position)}
                            onDoubleClick={() => tapTile(position)}
                            className="relative overflow-hidden rounded-xl border border-amber-300/30 shadow-lg transition active:scale-95"
                            style={{
                                backgroundImage: `url(${IMAGE})`,
                                backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                                backgroundPosition: `${(col / (GRID - 1)) * 100}% ${(row / (GRID - 1)) * 100}%`,
                            }}
                        >
                            <span className="absolute bottom-1 right-1.5 rounded bg-black/50 px-1 text-xs font-black text-amber-300">
                                {value + 1}
                            </span>
                        </button>
                    );
                })}
            </div>

            {outcome && (
                <GameResultPopup
                    won={outcome === 'win'}
                    title={outcome === 'win' ? 'Solved It!' : "Time's Up!"}
                    onPlayAgain={playAgain}
                    onDone={onBack}
                >
                    <p>{outcome === 'win' ? `You solved it in ${moves} moves.` : 'So close — want another shot?'}</p>
                </GameResultPopup>
            )}
        </div>
    );
}
