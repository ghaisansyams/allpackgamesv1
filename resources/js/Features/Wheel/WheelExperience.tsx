import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import Mascot from '@/Components/Kiosk/Mascot';
import SpinWheel from './SpinWheel';
import SpinReveal from './SpinReveal';
import { ContentApi, WheelApi } from '@/lib/api';
import type { WheelSegmentSummary, WheelSpinResult } from '@/types/content';

type Stage = 'loading' | 'idle' | 'spinning' | 'revealed';

export default function WheelExperience({
    visitorId,
    onExit,
    onBack,
    onGoToDecisionLab,
}: {
    visitorId: number | null;
    onExit: () => void;
    onBack: () => void;
    onGoToDecisionLab: () => void;
}) {
    const [stage, setStage] = useState<Stage>('loading');
    const [segments, setSegments] = useState<WheelSegmentSummary[]>([]);
    const [rotation, setRotation] = useState(0);
    const [spin, setSpin] = useState<WheelSpinResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ContentApi.wheel()
            .then((data) => {
                setSegments(data.segments);
                setStage('idle');
            })
            .catch(() => setError('Unable to load the wheel. Please check the connection.'));
    }, []);

    async function handleSpin() {
        if (segments.length === 0) return;
        setStage('spinning');
        setError(null);
        try {
            const result = await WheelApi.spin(visitorId);

            const segmentAngle = 360 / segments.length;
            const landingAngle = result.sort_order * segmentAngle + segmentAngle / 2;
            const extraTurns = 5;
            setRotation((prev) => {
                const baseline = prev - (prev % 360);
                return baseline + extraTurns * 360 + (360 - landingAngle);
            });

            window.setTimeout(() => {
                setSpin(result);
                setStage('revealed');
                if (result.outcome === 'win') {
                    WheelApi.handoff(result.id, visitorId);
                }
            }, 4000);
        } catch {
            setError('Something went wrong spinning the wheel. Please try again.');
            setStage('idle');
        }
    }

    function closeReveal() {
        setSpin(null);
        setStage('idle');
    }

    if (stage === 'loading' || segments.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <Mascot pose="thinking" className="h-24" />
                <p className="text-xl text-slate-300">{error ?? 'Loading experience…'}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-300 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {error && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-950/50 px-4 py-3 text-center text-red-300">{error}</p>}

            <div className="w-full text-center">
                <Mascot pose="idle" className="mx-auto mb-2 h-20" />
                <h2 className="mb-2 font-display text-4xl font-black uppercase tracking-wide text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    Spin. Play. Pack. Win!
                </h2>
                <p className="mb-8 text-slate-300">1 prize, 7 bombs — do you dare spin?</p>
                <SpinWheel segments={segments} rotation={rotation} spinning={stage === 'spinning'} />
                <TouchButton className="mt-10" disabled={stage === 'spinning'} onClick={handleSpin}>
                    {stage === 'spinning' ? 'Spinning…' : 'Spin Now'}
                </TouchButton>
                <div className="mt-4">
                    <button onClick={onGoToDecisionLab} className="text-sm text-slate-400 underline hover:text-slate-200">
                        Try Packaging Decision Lab instead
                    </button>
                </div>
            </div>

            {stage === 'revealed' && spin && (
                <SpinReveal
                    spin={spin}
                    onSpinAgain={() => {
                        closeReveal();
                        handleSpin();
                    }}
                    onDone={() => {
                        closeReveal();
                        onExit();
                    }}
                />
            )}
        </div>
    );
}
