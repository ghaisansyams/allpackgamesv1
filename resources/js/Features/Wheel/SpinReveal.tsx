import TouchButton from '@/Components/Kiosk/TouchButton';
import Mascot from '@/Components/Kiosk/Mascot';
import PrizeIcon from '@/Components/Kiosk/PrizeIcon';
import type { WheelSpinResult } from '@/types/content';

/**
 * A popup overlaid on the wheel screen, not a stage/page change — the wheel stays visible
 * behind it so the result reads as "what just happened on that wheel" rather than a
 * navigation away from the game.
 */
export default function SpinReveal({
    spin,
    onSpinAgain,
    onDone,
}: {
    spin: WheelSpinResult;
    onSpinAgain: () => void;
    onDone: () => void;
}) {
    const isWin = spin.outcome === 'win';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
            <div
                className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-2xl ${
                    isWin
                        ? 'border-amber-200/60 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-[0_0_60px_rgba(245,158,11,0.5)]'
                        : 'border-red-500/30 bg-gradient-to-br from-slate-950 via-[#1a0a12] to-slate-950 shadow-[0_0_60px_rgba(225,29,72,0.25)]'
                }`}
            >
                <Mascot pose={isWin ? 'celebrate' : 'doh'} className="mx-auto mb-2 h-24" bounce={isWin} />
                {isWin ? (
                    <PrizeIcon className="mx-auto mb-2 h-16 w-16" />
                ) : (
                    <img src="/images/wheel/bomb.png" alt="" className="mx-auto mb-2 h-20 w-20 object-contain" />
                )}
                <h2 className={`mb-3 font-display text-2xl font-black uppercase tracking-wide ${isWin ? 'text-amber-950' : 'text-amber-400'}`}>
                    {isWin ? (spin.reward_label ?? 'You Won!') : 'Boom!'}
                </h2>
                <p className={isWin ? 'text-amber-950/90' : 'text-slate-300'}>{spin.message}</p>

                <div className="mt-6 flex flex-col gap-3">
                    <TouchButton variant={isWin ? 'secondary' : 'ghost'} onClick={onSpinAgain}>
                        Spin Again
                    </TouchButton>
                    <button onClick={onDone} className={`text-sm font-semibold underline ${isWin ? 'text-amber-950/80' : 'text-slate-400'}`}>
                        {isWin ? 'Show This to Our Crew' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}
