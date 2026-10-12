import { Gift } from 'lucide-react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import type { WheelSpinResult } from '@/types/content';

export default function SpinReveal({
    spin,
    onSpinAgain,
    onContinue,
}: {
    spin: WheelSpinResult;
    onSpinAgain: () => void;
    onContinue: () => void;
}) {
    const isWin = spin.outcome === 'win';

    return (
        <div
            className={`mx-auto w-full max-w-2xl rounded-3xl p-10 text-center shadow-2xl ${
                isWin
                    ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300'
                    : 'bg-gradient-to-br from-slate-900 to-slate-800'
            }`}
        >
            {isWin ? (
                <Gift className="mx-auto mb-4 h-28 w-28 animate-bounce text-slate-900" strokeWidth={1.5} />
            ) : (
                <img src="/images/wheel/bomb.png" alt="" className="mx-auto mb-4 h-32 w-32 object-contain" />
            )}
            <h2 className={`mb-4 text-3xl font-black ${isWin ? 'text-slate-900' : 'text-amber-400'}`}>
                {isWin ? (spin.reward_label ?? 'You Won!') : 'Boom!'}
            </h2>
            <p className={isWin ? 'text-slate-800' : 'text-slate-200'}>{spin.message}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <TouchButton variant={isWin ? 'secondary' : 'ghost'} onClick={onSpinAgain}>
                    Spin Again
                </TouchButton>
                <TouchButton onClick={onContinue}>
                    {isWin ? 'Claim & Fill My Details' : 'Talk to Our Expert'}
                </TouchButton>
            </div>
        </div>
    );
}
