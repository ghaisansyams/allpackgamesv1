import { useRef, useState } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import GameResultPopup from '@/Components/Kiosk/GameResultPopup';
import { SpotMissingLogo } from '@/Components/Kiosk/GameLogos';
import { MiniGameApi } from '@/lib/api';

const IMAGE = '/images/spot-missing/booth-display.jpg';
const COLS = 4;
const ROWS = 5;
const CELLS = COLS * ROWS;
const TIME_LIMIT = 45;

export default function SpotMissingExperience({ visitorId, onBack }: { visitorId: number | null; onBack: () => void }) {
    const [missingCell, setMissingCell] = useState(() => Math.floor(Math.random() * CELLS));
    const [attempts, setAttempts] = useState(0);
    const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
    const [round, setRound] = useState(0);
    const [wrongFlash, setWrongFlash] = useState<number | null>(null);
    const startedAt = useRef(Date.now());
    const finished = useRef(false);

    function finish(result: 'win' | 'lose') {
        if (finished.current) return;
        finished.current = true;
        setOutcome(result);
        MiniGameApi.record('spot_missing', result === 'win', visitorId, {
            attempts,
            seconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
    }

    function tapCell(cell: number) {
        if (outcome) return;
        setAttempts((a) => a + 1);

        if (cell === missingCell) {
            finish('win');
        } else {
            setWrongFlash(cell);
            window.setTimeout(() => setWrongFlash(null), 300);
        }
    }

    function playAgain() {
        setMissingCell(Math.floor(Math.random() * CELLS));
        setAttempts(0);
        setOutcome(null);
        setWrongFlash(null);
        startedAt.current = Date.now();
        finished.current = false;
        setRound((r) => r + 1);
    }

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-300 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <SpotMissingLogo className="mb-2 h-20 w-20" />
            <h2 className="mb-1 font-display text-3xl font-black uppercase text-white">What's Missing?</h2>
            <p className="mb-4 text-center text-slate-300">Tap the spot where a product has disappeared.</p>

            {outcome === null && <CountdownBar key={round} totalSeconds={TIME_LIMIT} dangerSeconds={10} onExpire={() => finish('lose')} />}

            <p className="mb-4 font-display text-sm font-semibold text-amber-400">Attempts: {attempts}</p>

            <div
                className="relative mx-auto mb-4 grid overflow-hidden rounded-2xl border border-amber-400/30 shadow-2xl"
                style={{
                    width: 'min(90vw, 380px)',
                    aspectRatio: `${COLS} / ${ROWS}`,
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                }}
            >
                {Array.from({ length: CELLS }, (_, cell) => {
                    const col = cell % COLS;
                    const row = Math.floor(cell / COLS);
                    const isMissing = cell === missingCell;
                    const revealed = isMissing && outcome !== null;

                    return (
                        <button
                            key={cell}
                            onClick={() => tapCell(cell)}
                            disabled={outcome !== null}
                            className="relative border border-black/20"
                            style={
                                revealed
                                    ? undefined
                                    : {
                                          backgroundImage: isMissing ? undefined : `url(${IMAGE})`,
                                          backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                                          backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                                      }
                            }
                        >
                            {revealed && (
                                <div
                                    className="h-full w-full"
                                    style={{
                                        backgroundImage: `url(${IMAGE})`,
                                        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                                        backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                                    }}
                                />
                            )}
                            {isMissing && !revealed && (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-700 to-red-900">
                                    <HelpCircle className="h-1/2 w-1/2 text-amber-300/70" strokeWidth={1.5} />
                                </div>
                            )}
                            {wrongFlash === cell && <div className="absolute inset-0 bg-red-500/50" />}
                        </button>
                    );
                })}
            </div>

            {outcome && (
                <GameResultPopup
                    won={outcome === 'win'}
                    title={outcome === 'win' ? 'Sharp Eyes!' : "Time's Up!"}
                    onPlayAgain={playAgain}
                    onDone={onBack}
                >
                    <p>
                        {outcome === 'win'
                            ? `You spotted it in ${attempts} ${attempts === 1 ? 'try' : 'tries'}.`
                            : 'The missing spot is highlighted above — want another shot?'}
                    </p>
                </GameResultPopup>
            )}
        </div>
    );
}
