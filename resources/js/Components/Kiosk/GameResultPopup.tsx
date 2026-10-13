import { PropsWithChildren } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import Mascot, { MascotPose } from '@/Components/Kiosk/Mascot';

export default function GameResultPopup({
    won,
    title,
    onPlayAgain,
    onDone,
    children,
}: PropsWithChildren<{
    won: boolean;
    title: string;
    onPlayAgain: () => void;
    onDone: () => void;
}>) {
    const pose: MascotPose = won ? 'celebrate' : 'doh';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
            <div
                className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-2xl ${
                    won
                        ? 'border-amber-200/60 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-[0_0_60px_rgba(245,158,11,0.5)]'
                        : 'border-red-500/30 bg-gradient-to-br from-slate-950 via-[#1a0a12] to-slate-950 shadow-[0_0_60px_rgba(225,29,72,0.25)]'
                }`}
            >
                <Mascot pose={pose} className="mx-auto mb-3 h-24" bounce={won} />
                <h2 className={`mb-3 font-display text-2xl font-black uppercase tracking-wide ${won ? 'text-amber-950' : 'text-amber-400'}`}>
                    {title}
                </h2>
                <div className={won ? 'text-amber-950/90' : 'text-slate-300'}>{children}</div>

                <div className="mt-6 flex flex-col gap-3">
                    <TouchButton variant={won ? 'secondary' : 'ghost'} onClick={onPlayAgain}>
                        Play Again
                    </TouchButton>
                    <button onClick={onDone} className={`text-sm font-semibold underline ${won ? 'text-amber-950/80' : 'text-slate-400'}`}>
                        {won ? 'Show This to Our Crew' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}
