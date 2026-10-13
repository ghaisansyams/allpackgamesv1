import PrizeIcon from '@/Components/Kiosk/PrizeIcon';
import type { WheelSegmentSummary } from '@/types/content';

const CENTER = 100;
const RADIUS = 92;
const IMAGE_RADIUS = 58;
const IMAGE_SIZE = 34;
const BULB_RADIUS = 97;

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
    const bulbs = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="relative mx-auto h-[min(92vw,620px)] w-[min(92vw,620px)]">
            {/* Ambient casino glow behind the whole wheel */}
            <div className="pointer-events-none absolute inset-[-10%] -z-10 rounded-full bg-gradient-to-br from-amber-400/40 via-red-600/30 to-amber-600/30 blur-[60px]" />

            {/* Pointer */}
            <div className="absolute left-1/2 top-[-30px] z-30 -translate-x-1/2">
                <svg width="56" height="64" viewBox="0 0 56 64">
                    <defs>
                        <linearGradient id="pointer-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff7cc" />
                            <stop offset="45%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M28 64 L4 18 Q4 2 28 2 Q52 2 52 18 Z"
                        fill="url(#pointer-gold)"
                        stroke="#78350f"
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}
                    />
                    <circle cx="28" cy="16" r="6" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
                </svg>
            </div>

            <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible rounded-full">
                {/* Outer ornate gold ring */}
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 8} fill="none" stroke="#78350f" strokeWidth="3" />
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="url(#rim-gradient)" />
                <defs>
                    <linearGradient id="rim-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="50%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <radialGradient id="hub-gradient" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fffbeb" />
                        <stop offset="45%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#92400e" />
                    </radialGradient>
                </defs>

                {bulbs.map((i) => {
                    const angle = i * (360 / bulbs.length);
                    const { x, y } = polar(BULB_RADIUS, angle);
                    return (
                        <circle
                            key={`bulb-${i}`}
                            cx={x}
                            cy={y}
                            r={2.6}
                            fill={i % 2 === 0 ? '#fef08a' : '#fde047'}
                            stroke="#78350f"
                            strokeWidth="0.5"
                            style={{ filter: 'drop-shadow(0 0 4px #fde047)' }}
                            className={spinning ? 'animate-pulse' : ''}
                        />
                    );
                })}

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
                        const isWin = segment.outcome === 'win';
                        return (
                            <path
                                key={segment.id}
                                d={d}
                                fill={isWin ? '#fbbf24' : i % 2 === 0 ? '#b91c1c' : '#7f1d1d'}
                                stroke="#fde68a"
                                strokeWidth="1"
                            />
                        );
                    })}
                    {/* Thin gold divider lines between wedges, circus-wheel style */}
                    {segments.map((_, i) => {
                        const p = polar(RADIUS, i * segmentAngle);
                        return (
                            <line
                                key={`divider-${i}`}
                                x1={CENTER}
                                y1={CENTER}
                                x2={p.x}
                                y2={p.y}
                                stroke="#fde68a"
                                strokeWidth="1.5"
                                opacity="0.8"
                            />
                        );
                    })}
                    {segments.map((segment, i) => {
                        const mid = i * segmentAngle + segmentAngle / 2;
                        const { x, y } = polar(IMAGE_RADIUS, mid);
                        const isWin = segment.outcome === 'win';
                        return (
                            <foreignObject
                                key={`icon-${segment.id}`}
                                x={x - IMAGE_SIZE / 2}
                                y={y - IMAGE_SIZE / 2}
                                width={IMAGE_SIZE}
                                height={IMAGE_SIZE}
                                style={{ overflow: 'visible' }}
                            >
                                {isWin ? (
                                    <PrizeIcon className="h-full w-full" />
                                ) : (
                                    <img
                                        src="/images/wheel/bomb.png"
                                        alt=""
                                        className="h-full w-full object-contain"
                                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }}
                                    />
                                )}
                            </foreignObject>
                        );
                    })}
                </g>

                {/* Hub */}
                <circle cx={CENTER} cy={CENTER} r={20} fill="url(#hub-gradient)" stroke="#78350f" strokeWidth="2" />
                <circle cx={CENTER} cy={CENTER} r={20} fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.8" />
            </svg>

            <div
                className="absolute inset-0 m-auto flex h-[20%] w-[20%] items-center justify-center font-display text-sm font-black uppercase tracking-wider text-red-900"
                style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}
            >
                Spin
            </div>
        </div>
    );
}
