import Icon from '@/lib/icons';
import type { WheelSegmentSummary } from '@/types/content';

const COLORS = [
    '#0f766e',
    '#15803d',
    '#b45309',
    '#0369a1',
    '#7c2d12',
    '#4d7c0f',
    '#a16207',
    '#1e3a8a',
];

export default function SpinWheel({
    segments,
    rotation,
    spinning,
}: {
    segments: WheelSegmentSummary[];
    rotation: number;
    spinning: boolean;
}) {
    const segmentAngle = 360 / segments.length;
    const gradientStops = segments
        .map((_, i) => {
            const from = (i / segments.length) * 100;
            const to = ((i + 1) / segments.length) * 100;
            return `${COLORS[i % COLORS.length]} ${from}% ${to}%`;
        })
        .join(', ');

    return (
        <div className="relative mx-auto h-[min(72vw,480px)] w-[min(72vw,480px)]">
            <div
                className="h-10 w-10 absolute left-1/2 top-[-14px] z-20 -translate-x-1/2"
                style={{
                    clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                    background: '#f59e0b',
                }}
            />
            <div
                className="h-full w-full overflow-hidden rounded-full border-8 border-slate-900 shadow-2xl"
                style={{
                    background: `conic-gradient(from 0deg, ${gradientStops})`,
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : undefined,
                }}
            >
                {segments.map((segment, i) => {
                    const angle = i * segmentAngle + segmentAngle / 2;
                    return (
                        <div
                            key={`label-${segment.id}`}
                            className="absolute inset-0 flex justify-center"
                            style={{ transform: `rotate(${angle}deg)` }}
                        >
                            <div
                                className="mt-[12%] flex w-20 flex-col items-center gap-1 text-center"
                                style={{ transform: `rotate(${-angle}deg)` }}
                            >
                                <Icon name={segment.category} className="h-6 w-6 text-white drop-shadow" />
                                <span className="text-[11px] font-bold leading-tight text-white drop-shadow">
                                    {segment.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500 bg-slate-900 text-xs font-black text-amber-400">
                SPIN
            </div>
        </div>
    );
}
