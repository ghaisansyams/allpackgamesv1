import { useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import type { DecisionResult } from '@/types/content';

export default function ResultStage({
    result,
    onSendEmail,
    onTalkToExpert,
    onRestart,
}: {
    result: DecisionResult;
    onSendEmail: () => Promise<void>;
    onTalkToExpert: () => Promise<void>;
    onRestart: () => void;
}) {
    const [emailSent, setEmailSent] = useState(false);
    const [expertRequested, setExpertRequested] = useState(false);

    const fitLabel = result.fit_score >= 85 ? 'Strong Fit' : result.fit_score >= 65 ? 'Good Fit' : 'Fair Fit';

    return (
        <div className="mx-auto w-full max-w-4xl">
            <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Your Packaging Decision
            </p>
            <h2 className="mb-8 text-center text-3xl font-black text-slate-900">
                Can You Make the Right Packaging Decision?
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-900 p-8 text-white">
                    <span className="text-sm uppercase tracking-widest text-slate-300">Your Packaging Decision</span>
                    <span className="my-2 text-7xl font-black text-amber-400">{result.fit_score}</span>
                    <span className="text-slate-300">/ 100</span>
                    <span className="mt-4 rounded-full bg-amber-500 px-6 py-2 font-bold text-slate-900">
                        {fitLabel}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <ResultTile label="Your Strength" value={result.strength} icon="✓" />
                    <ResultTile label="Your Profile" value={result.profile} icon="●" />
                    <ResultTile label="Your Trade-off" value={result.trade_off} icon="!" />
                </div>
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">ALLPACK Solution</p>
                <p className="text-xl font-bold text-slate-900">{result.solution_label}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TouchButton
                    variant="secondary"
                    disabled={emailSent}
                    onClick={async () => {
                        await onSendEmail();
                        setEmailSent(true);
                    }}
                >
                    {emailSent ? 'Result Sent ✓' : 'Kirim Hasil ke Email'}
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

            <div className="mt-6 text-center">
                <button onClick={onRestart} className="text-slate-500 underline">
                    Start a new session
                </button>
            </div>
        </div>
    );
}

function ResultTile({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {icon}
            </span>
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="text-lg font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}
