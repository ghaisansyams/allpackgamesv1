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

const CENTER = 100;
const RADIUS = 94;
const LABEL_RADIUS = 60;

/** Point on the wheel at `angleDeg` clockwise from the 12 o'clock position. */
function polar(radius: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: CENTER + radius * Math.sin(rad),
        y: CENTER - radius * Math.cos(rad),
    };
}

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

    return (
        <div className="relative mx-auto h-[min(72vw,480px)] w-[min(72vw,480px)]">
            <div
                className="absolute left-1/2 top-[-14px] z-20 h-10 w-10 -translate-x-1/2"
                style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)', background: '#f59e0b' }}
            />
            <svg
                viewBox="0 0 200 200"
                className="h-full w-full overflow-visible rounded-full border-8 border-slate-900 shadow-2xl"
            >
                <g
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: '50% 50%',
                        transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : undefined,
                    }}
                >
                    {segments.map((segment, i) => {
                        const start = polar(RADIUS, i * segmentAngle);
                        const end = polar(RADIUS, (i + 1) * segmentAngle);
                        const d = `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y} Z`;
                        return <path key={segment.id} d={d} fill={COLORS[i % COLORS.length]} />;
                    })}
                    {segments.map((segment, i) => {
                        const mid = i * segmentAngle + segmentAngle / 2;
                        const { x, y } = polar(LABEL_RADIUS, mid);
                        return (
                            <foreignObject key={`label-${segment.id}`} x={x - 32} y={y - 32} width={64} height={64}>
                                <div className="flex h-16 w-16 flex-col items-center justify-center gap-0.5 text-center">
                                    <Icon name={segment.category} className="h-5 w-5 text-white drop-shadow" />
                                    <span className="text-[9px] font-bold leading-tight text-white drop-shadow">
                                        {segment.label}
                                    </span>
                                </div>
                            </foreignObject>
                        );
                    })}
                </g>
            </svg>
            <div className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500 bg-slate-900 text-xs font-black text-amber-400">
                SPIN
            </div>
        </div>
    );
}
