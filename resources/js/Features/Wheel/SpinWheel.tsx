const SLOT_COUNT = 8;

// Muted dark-neon alternating palette (two tones) purely for visual appeal — every wedge
// shows the identical mystery box image regardless of color, so color carries no
// information about the outcome.
const COLORS = ['#3b2f63', '#2a2550'];

const CENTER = 100;
const RADIUS = 94;
const IMAGE_RADIUS = 60;
const IMAGE_SIZE = 30;
const BULB_RADIUS = 97;

/** Point on the wheel at `angleDeg` clockwise from the 12 o'clock position. */
function polar(radius: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: CENTER + radius * Math.sin(rad),
        y: CENTER - radius * Math.cos(rad),
    };
}

export default function SpinWheel({ rotation, spinning }: { rotation: number; spinning: boolean }) {
    const segmentAngle = 360 / SLOT_COUNT;
    const slots = Array.from({ length: SLOT_COUNT }, (_, i) => i);
    const bulbs = Array.from({ length: 16 }, (_, i) => i);

    return (
        <div className="relative mx-auto h-[min(80vw,480px)] w-[min(80vw,480px)]">
            <div className="absolute inset-[-8%] -z-10 rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900 opacity-50 blur-2xl" />

            <div
                className="absolute left-1/2 top-[-20px] z-20 h-11 w-9 -translate-x-1/2"
                style={{
                    clipPath: 'polygon(50% 100%, 10% 0, 90% 0)',
                    background: 'transparent',
                    border: '3px solid #f0abfc',
                    filter: 'drop-shadow(0 0 6px #e879f9) drop-shadow(0 0 12px #c026d3)',
                }}
            />

            <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible rounded-full shadow-2xl">
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="#120f26" />
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="none" stroke="#f0abfc" strokeWidth={0.6} opacity={0.5} />

                {bulbs.map((i) => {
                    const angle = i * (360 / bulbs.length);
                    const { x, y } = polar(BULB_RADIUS, angle);
                    return (
                        <circle
                            key={`bulb-${i}`}
                            cx={x}
                            cy={y}
                            r={2.2}
                            fill="#fdf4ff"
                            style={{ filter: 'drop-shadow(0 0 3px #f0abfc)' }}
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
                    {slots.map((i) => {
                        const start = polar(RADIUS, i * segmentAngle);
                        const end = polar(RADIUS, (i + 1) * segmentAngle);
                        const d = `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y} Z`;
                        return <path key={i} d={d} fill={COLORS[i % COLORS.length]} stroke="#1a1533" strokeWidth={1} />;
                    })}
                    {slots.map((i) => {
                        const mid = i * segmentAngle + segmentAngle / 2;
                        const { x, y } = polar(IMAGE_RADIUS, mid);
                        return (
                            <image
                                key={`img-${i}`}
                                href="/images/wheel/mystery-box.png"
                                x={x - IMAGE_SIZE / 2}
                                y={y - IMAGE_SIZE / 2}
                                width={IMAGE_SIZE}
                                height={IMAGE_SIZE}
                                style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }}
                            />
                        );
                    })}
                </g>
            </svg>

            <div className="absolute inset-0 m-auto flex h-[22%] w-[22%] items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-200 text-sm font-black text-indigo-900 shadow-[0_0_20px_rgba(240,171,252,0.6)]">
                SPIN
            </div>
        </div>
    );
}
