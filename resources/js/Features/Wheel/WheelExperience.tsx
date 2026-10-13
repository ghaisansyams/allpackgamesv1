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
            <div className="flex min-h-full flex-col items-center justify-center gap-4">
                <Mascot pose="thinking" className="h-24" />
                <p className="text-xl text-slate-500">{error ?? 'Loading experience…'}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-6 py-10">
            <button
                onClick={onBack}
                className="mb-4 flex w-fit items-center gap-2 self-start text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-red-700">{error}</p>}

            <div className="w-full text-center">
                <Mascot pose="idle" className="mx-auto mb-2 h-20" />
                <h2 className="mb-2 text-3xl font-black text-slate-900">SPIN. PLAY. PACK. WIN!</h2>
                <p className="mb-8 text-slate-600">1 prize, 7 bombs — do you dare spin?</p>
                <SpinWheel segments={segments} rotation={rotation} spinning={stage === 'spinning'} />
                <TouchButton className="mt-10" disabled={stage === 'spinning'} onClick={handleSpin}>
                    {stage === 'spinning' ? 'Spinning…' : 'Spin Now'}
                </TouchButton>
                <div className="mt-4">
                    <button onClick={onGoToDecisionLab} className="text-sm text-slate-500 underline">
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
