import { Gift } from 'lucide-react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import Mascot from '@/Components/Kiosk/Mascot';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
            <div
                className={`w-full max-w-md rounded-3xl p-8 text-center shadow-2xl ${
                    isWin
                        ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300'
                        : 'bg-gradient-to-br from-slate-900 to-slate-800'
                }`}
            >
                <Mascot pose={isWin ? 'celebrate' : 'doh'} className="mx-auto mb-2 h-24" bounce={isWin} />
                {isWin ? (
                    <Gift className="mx-auto mb-2 h-16 w-16 text-slate-900" strokeWidth={1.5} />
                ) : (
                    <img src="/images/wheel/bomb.png" alt="" className="mx-auto mb-2 h-20 w-20 object-contain" />
                )}
                <h2 className={`mb-3 text-2xl font-black ${isWin ? 'text-slate-900' : 'text-amber-400'}`}>
                    {isWin ? (spin.reward_label ?? 'You Won!') : 'Boom!'}
                </h2>
                <p className={isWin ? 'text-slate-800' : 'text-slate-200'}>{spin.message}</p>

                <div className="mt-6 flex flex-col gap-3">
                    <TouchButton variant={isWin ? 'secondary' : 'ghost'} onClick={onSpinAgain}>
                        Spin Again
                    </TouchButton>
                    <button onClick={onDone} className={`text-sm font-semibold underline ${isWin ? 'text-slate-800' : 'text-slate-300'}`}>
                        {isWin ? 'Show This to Our Crew' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}
