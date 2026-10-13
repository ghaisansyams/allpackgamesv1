import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import DecisionLabExperience from '@/Features/DecisionLab/DecisionLabExperience';
import WheelExperience from '@/Features/Wheel/WheelExperience';
import { useIdleReset } from '@/lib/useIdleReset';

type Screen = 'attract' | 'choose' | 'wheel' | 'decision_lab';

export default function Hub() {
    const [screen, setScreen] = useState<Screen>('attract');

    const resetToAttract = useCallback(() => setScreen('attract'), []);
    const goToChoose = useCallback(() => setScreen('choose'), []);

    useIdleReset(resetToAttract, 90_000, screen !== 'attract');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
            <Head title="ALLPACK 2026 — Interactive Experience Hub" />

            {screen === 'attract' && (
                <button
                    onClick={() => setScreen('choose')}
                    className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center"
                >
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                        ALLPACK 2026 · Interactive Experience Hub
                    </p>
                    <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">
                        GROWING OUR
                        <br />
                        TOMORROW
                    </h1>
                    <p className="max-w-xl text-lg text-slate-300">From Paper to Possibility</p>
                    <span className="mt-10 animate-pulse rounded-full bg-amber-500 px-10 py-4 text-xl font-bold text-slate-900">
                        Tap to Start
                    </span>
                </button>
            )}

            {screen === 'choose' && (
                <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                            Choose Your Experience
                        </p>
                        <h1 className="text-4xl font-black text-white">Two Ways to Explore ALLPACK</h1>
                    </div>
                    <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                        <ExperienceCard
                            title="Digital Wheel of Fortune"
                            tagline="SPIN. PLAY. PACK. WIN!"
                            description="Fast engagement — traffic driver, reward, discovery."
                            onClick={() => setScreen('wheel')}
                        />
                        <ExperienceCard
                            title="Packaging Decision Lab"
                            tagline="Can You Make the Right Packaging Decision?"
                            description="Deeper engagement — business decision, qualified conversation."
                            onClick={() => setScreen('decision_lab')}
                        />
                    </div>
                    <button onClick={resetToAttract} className="text-slate-400 underline">
                        Back
                    </button>
                </div>
            )}

            {screen !== 'attract' && screen !== 'choose' && (
                <div className="min-h-screen bg-slate-50">
                    {screen === 'wheel' && (
                        <WheelExperience
                            onExit={resetToAttract}
                            onBack={goToChoose}
                            onGoToDecisionLab={() => setScreen('decision_lab')}
                        />
                    )}
                    {screen === 'decision_lab' && (
                        <DecisionLabExperience onExit={resetToAttract} onBack={goToChoose} />
                    )}
                </div>
            )}
        </div>
    );
}

function ExperienceCard({
    title,
    tagline,
    description,
    onClick,
}: {
    title: string;
    tagline: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex min-h-[220px] flex-col items-start justify-between gap-4 rounded-3xl border-2 border-white/10 bg-white/5 p-8 text-left shadow-2xl transition hover:border-amber-400 hover:bg-white/10 active:scale-95"
        >
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">{tagline}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
                <p className="mt-2 text-slate-300">{description}</p>
            </div>
            <span className="font-bold text-amber-400">Tap to Enter →</span>
        </button>
    );
}
