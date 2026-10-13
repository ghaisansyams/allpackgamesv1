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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
            <div
                className={`w-full max-w-md rounded-3xl p-8 text-center shadow-2xl ${
                    won
                        ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300'
                        : 'bg-gradient-to-br from-slate-900 to-slate-800'
                }`}
            >
                <Mascot pose={pose} className="mx-auto mb-3 h-24" bounce={won} />
                <h2 className={`mb-3 text-2xl font-black ${won ? 'text-slate-900' : 'text-amber-400'}`}>{title}</h2>
                <div className={won ? 'text-slate-800' : 'text-slate-200'}>{children}</div>

                <div className="mt-6 flex flex-col gap-3">
                    <TouchButton variant={won ? 'secondary' : 'ghost'} onClick={onPlayAgain}>
                        Play Again
                    </TouchButton>
                    <button onClick={onDone} className={`text-sm font-semibold underline ${won ? 'text-slate-800' : 'text-slate-300'}`}>
                        {won ? 'Show This to Our Crew' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}
