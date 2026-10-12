import { PropsWithChildren, useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import { WheelApi } from '@/lib/api';
import type { WheelAnswerResult, WheelSpinResult } from '@/types/content';

export default function SpinReveal({
    spin,
    onSpinAgain,
    onContinue,
}: {
    spin: WheelSpinResult;
    onSpinAgain: () => void;
    onContinue: () => void;
}) {
    const [answer, setAnswer] = useState<WheelAnswerResult | null>(null);
    const [challengeRevealed, setChallengeRevealed] = useState(false);

    if (spin.category === 'spin_again') {
        return (
            <RevealShell title={spin.label}>
                <p className="text-xl text-slate-200">{spin.content.insight}</p>
                <TouchButton className="mt-8" onClick={onSpinAgain}>
                    Spin Again
                </TouchButton>
            </RevealShell>
        );
    }

    if (spin.category === 'pack_quiz' && spin.content.question) {
        return (
            <RevealShell title="Pack Quiz">
                <p className="mb-6 text-xl font-bold text-white">{spin.content.question}</p>
                {!answer ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {spin.content.options?.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => WheelApi.answer(spin.id, i).then(setAnswer)}
                                className="min-h-[56px] rounded-xl bg-white/10 px-4 text-left text-white transition hover:bg-white/20 active:scale-95"
                            >
                                {String.fromCharCode(65 + i)}. {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div>
                        <p className={`mb-3 text-2xl font-black ${answer.is_correct ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {answer.is_correct ? 'Correct! 🎉' : 'Good try!'}
                        </p>
                        <p className="text-slate-200">{answer.insight}</p>
                        <TouchButton className="mt-8" onClick={onContinue}>
                            Continue
                        </TouchButton>
                    </div>
                )}
            </RevealShell>
        );
    }

    if (spin.category === 'pack_challenge' && spin.content.challenge) {
        return (
            <RevealShell title="Pack Challenge">
                <p className="mb-6 text-xl font-bold text-white">{spin.content.challenge}</p>
                {!challengeRevealed ? (
                    <TouchButton onClick={() => setChallengeRevealed(true)}>Reveal Insight</TouchButton>
                ) : (
                    <div>
                        <p className="text-slate-200">{spin.content.insight}</p>
                        <TouchButton className="mt-8" onClick={onContinue}>
                            Continue
                        </TouchButton>
                    </div>
                )}
            </RevealShell>
        );
    }

    // lucky_pack, bonus_pack, jackpot, pack_smart, mystery_pack
    return (
        <RevealShell title={spin.reward_label ?? spin.label}>
            <p className="text-xl text-slate-200">{spin.content.insight}</p>
            <TouchButton className="mt-8" onClick={onContinue}>
                Continue
            </TouchButton>
        </RevealShell>
    );
}

function RevealShell({ title, children }: PropsWithChildren<{ title: string }>) {
    return (
        <div className="mx-auto w-full max-w-2xl rounded-3xl bg-slate-900 p-10 text-center shadow-2xl">
            <h2 className="mb-6 text-3xl font-black text-amber-400">{title}</h2>
            {children}
        </div>
    );
}
