import { useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import type { DecisionResult } from '@/types/content';

export default function ResultStage({
    result,
    onSendEmail,
    onTalkToExpert,
    onBack,
}: {
    result: DecisionResult;
    onSendEmail: () => Promise<{ ok: boolean; message?: string }>;
    onTalkToExpert: () => Promise<{ ok: boolean; message?: string }>;
    onBack: () => void;
}) {
    const [emailSent, setEmailSent] = useState(false);
    const [expertRequested, setExpertRequested] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);

    const fitLabel = result.fit_score >= 85 ? 'Strong Fit' : result.fit_score >= 65 ? 'Good Fit' : 'Fair Fit';

    return (
        <div className="mx-auto w-full max-w-4xl">
            <p className="mb-2 text-center font-display text-sm font-semibold uppercase tracking-widest text-amber-400">
                Your Packaging Decision
            </p>
            <h2 className="mb-8 text-center font-display text-3xl font-black uppercase text-white">
                Can You Make the Right Packaging Decision?
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-center rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#1a1430] to-[#0f0a1f] p-8 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                    <span className="text-sm uppercase tracking-widest text-slate-400">Your Packaging Decision</span>
                    <span className="my-2 font-display text-7xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                        {result.fit_score}
                    </span>
                    <span className="text-slate-400">/ 100</span>
                    <span className="mt-4 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 px-6 py-2 font-display font-bold text-amber-950 shadow-[0_0_14px_rgba(245,158,11,0.5)]">
                        {fitLabel}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ResultTile label="Your Strength" value={result.strength} icon="✓" />
                    <ResultTile label="Your Profile" value={result.profile} icon="●" />
                    <ResultTile label="Your Trade-off" value={result.trade_off} icon="!" />
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="font-display text-sm font-semibold uppercase tracking-widest text-amber-400">ALLPACK Solution</p>
                <p className="text-xl font-bold text-white">{result.solution_label}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TouchButton
                    variant="secondary"
                    disabled={emailSent || sendingEmail}
                    onClick={async () => {
                        setSendingEmail(true);
                        setEmailError(null);
                        const { ok, message } = await onSendEmail();
                        setSendingEmail(false);
                        if (ok) {
                            setEmailSent(true);
                        } else {
                            setEmailError(message ?? 'Could not send the email. Please try again.');
                        }
                    }}
                >
                    {emailSent ? 'Result Sent ✓' : sendingEmail ? 'Sending…' : 'Kirim Hasil ke Email'}
                </TouchButton>
                <TouchButton
                    disabled={expertRequested}
                    onClick={async () => {
                        await onTalkToExpert();
                        setExpertRequested(true);
                    }}
                >
                    {expertRequested ? 'Our Team Is Coming ✓' : 'Talk to Our Expert'}
                </TouchButton>
            </div>

            {emailError && (
                <p className="mt-3 text-center text-sm text-red-400">{emailError}</p>
            )}

            <div className="mt-6 text-center">
                <button onClick={onBack} className="text-slate-400 underline hover:text-slate-200">
                    Choose Another Game
                </button>
            </div>
        </div>
    );
}

function ResultTile({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-amber-400/20 bg-white/[0.06] p-5 backdrop-blur-xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-600 font-bold text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                {icon}
            </span>
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
            </div>
        </div>
    );
}
