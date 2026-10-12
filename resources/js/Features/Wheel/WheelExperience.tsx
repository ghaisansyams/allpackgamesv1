import { useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import SpinWheel from './SpinWheel';
import SpinReveal from './SpinReveal';
import WheelLeadForm from './WheelLeadForm';
import { WheelApi } from '@/lib/api';
import type { WheelSpinResult } from '@/types/content';

const SLOT_COUNT = 8;

type Stage = 'idle' | 'spinning' | 'revealed' | 'lead' | 'thanks';

export default function WheelExperience({ onExit, onGoToDecisionLab }: { onExit: () => void; onGoToDecisionLab: () => void }) {
    const [stage, setStage] = useState<Stage>('idle');
    const [rotation, setRotation] = useState(0);
    const [spin, setSpin] = useState<WheelSpinResult | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSpin() {
        setStage('spinning');
        setError(null);
        try {
            const result = await WheelApi.spin();

            // The landing position is purely cosmetic: every wedge looks identical (a mystery
            // box), so which one the wheel visually stops on carries no information about the
            // real win/bomb outcome, which is only ever revealed afterwards.
            const segmentAngle = 360 / SLOT_COUNT;
            const cosmeticIndex = Math.floor(Math.random() * SLOT_COUNT);
            const landingAngle = cosmeticIndex * segmentAngle + segmentAngle / 2;
            const extraTurns = 5;
            setRotation((prev) => {
                const baseline = prev - (prev % 360);
                return baseline + extraTurns * 360 + (360 - landingAngle);
            });

            window.setTimeout(() => {
                setSpin(result);
                setStage('revealed');
            }, 4000);
        } catch {
            setError('Something went wrong spinning the wheel. Please try again.');
            setStage('idle');
        }
    }

    async function handleLeadSubmit(data: { name: string; company: string; job_title: string; contact: string }) {
        if (!spin) return;
        setSubmitting(true);
        try {
            await WheelApi.handoff(spin.id, data);
            setStage('thanks');
        } catch {
            setError('Could not save your details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    function reset() {
        setSpin(null);
        setStage('idle');
        onExit();
    }

    return (
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-6 py-10">
            {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-red-700">{error}</p>}

            {(stage === 'idle' || stage === 'spinning') && (
                <div className="w-full text-center">
                    <h2 className="mb-2 text-3xl font-black text-slate-900">SPIN. PLAY. PACK. WIN!</h2>
                    <p className="mb-8 text-slate-600">One mystery box hides the prize. Do you dare spin?</p>
                    <SpinWheel rotation={rotation} spinning={stage === 'spinning'} />
                    <TouchButton className="mt-10" disabled={stage === 'spinning'} onClick={handleSpin}>
                        {stage === 'spinning' ? 'Spinning…' : 'Spin Now'}
                    </TouchButton>
                </div>
            )}

            {stage === 'revealed' && spin && (
                <SpinReveal spin={spin} onSpinAgain={handleSpin} onContinue={() => setStage('lead')} />
            )}

            {stage === 'lead' && (
                <div className="w-full">
                    <WheelLeadForm onSubmit={handleLeadSubmit} submitting={submitting} />
                    <div className="mt-4 text-center">
                        <button onClick={() => setStage('thanks')} className="text-slate-500 underline">
                            Skip for now
                        </button>
                    </div>
                </div>
            )}

            {stage === 'thanks' && (
                <div className="w-full max-w-xl rounded-3xl bg-emerald-700 p-10 text-center text-white shadow-2xl">
                    <h2 className="mb-2 text-3xl font-black">Thank You!</h2>
                    <p className="mb-8 text-emerald-100">
                        Show this screen to our booth crew to claim your reward and discover more ALLPACK solutions.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <TouchButton variant="secondary" onClick={onGoToDecisionLab}>
                            Try Packaging Decision Lab
                        </TouchButton>
                        <TouchButton onClick={reset}>Done</TouchButton>
                    </div>
                </div>
            )}
        </div>
    );
}
