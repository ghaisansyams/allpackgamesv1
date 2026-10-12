const SLOT_COUNT = 8;

// Vivid alternating palette purely for visual appeal — every wedge shows the identical
// mystery box image regardless of color, so color carries no information about the outcome.
const COLORS = ['#7c3aed', '#db2777', '#2563eb', '#ea580c', '#16a34a', '#ca8a04', '#0891b2', '#dc2626'];

const CENTER = 100;
const RADIUS = 94;
const IMAGE_RADIUS = 58;
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
        <div className="relative mx-auto h-[min(80vw,520px)] w-[min(80vw,520px)]">
            <div className="absolute inset-[-6%] -z-10 rounded-full bg-gradient-to-br from-amber-400 via-fuchsia-500 to-indigo-600 opacity-40 blur-2xl" />

            <div
                className="absolute left-1/2 top-[-18px] z-20 h-12 w-12 -translate-x-1/2 drop-shadow-lg"
                style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)', background: 'linear-gradient(180deg,#fde047,#f59e0b)' }}
            />

            <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible rounded-full shadow-2xl">
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 5} fill="#1e1b4b" />

                {bulbs.map((i) => {
                    const angle = i * (360 / bulbs.length);
                    const { x, y } = polar(BULB_RADIUS, angle);
                    return (
                        <circle
                            key={`bulb-${i}`}
                            cx={x}
                            cy={y}
                            r={2.6}
                            fill={i % 2 === 0 ? '#fde047' : '#fff7ed'}
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
                        return <path key={i} d={d} fill={COLORS[i % COLORS.length]} stroke="#1e1b4b" strokeWidth={1.5} />;
                    })}
                    {slots.map((i) => {
                        const mid = i * segmentAngle + segmentAngle / 2;
                        const { x, y } = polar(IMAGE_RADIUS, mid);
                        return (
                            <image
                                key={`img-${i}`}
                                href="/images/wheel/mystery-box.png"
                                x={x - 22}
                                y={y - 22}
                                width={44}
                                height={44}
                                style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }}
                            />
                        );
                    })}
                </g>
            </svg>

            <div className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-400 bg-gradient-to-br from-indigo-700 to-fuchsia-700 text-sm font-black text-amber-300 shadow-lg">
                SPIN
            </div>
        </div>
    );
}
