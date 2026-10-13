/**
 * One small animated SVG "logo" per game — built as plain CSS/SVG animation (no extra
 * dependency), each shaped to read instantly as its own game rather than a generic icon.
 */

export function WheelLogo({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className}>
            <circle cx="24" cy="24" r="21" fill="none" stroke="#fde68a" strokeWidth="2" />
            <g style={{ transformOrigin: '24px 24px', animation: 'logo-spin 4s linear infinite' }}>
                {Array.from({ length: 8 }, (_, i) => {
                    const a1 = (i * 45 * Math.PI) / 180;
                    const a2 = ((i + 1) * 45 * Math.PI) / 180;
                    const x1 = 24 + 20 * Math.sin(a1);
                    const y1 = 24 - 20 * Math.cos(a1);
                    const x2 = 24 + 20 * Math.sin(a2);
                    const y2 = 24 - 20 * Math.cos(a2);
                    return (
                        <path
                            key={i}
                            d={`M24 24 L${x1} ${y1} A20 20 0 0 1 ${x2} ${y2} Z`}
                            fill={i % 2 === 0 ? '#dc2626' : '#f59e0b'}
                        />
                    );
                })}
                <circle cx="24" cy="24" r="5" fill="#fde68a" stroke="#78350f" strokeWidth="1" />
            </g>
            <path d="M24 2 L19 10 L29 10 Z" fill="#fde68a" />
        </svg>
    );
}

export function DecisionLogo({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className}>
            <g style={{ transformOrigin: '24px 30px', animation: 'logo-tilt 2.4s ease-in-out infinite' }}>
                <rect x="10" y="20" width="28" height="18" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                <path d="M10 20 L24 12 L38 20" fill="none" stroke="#fde68a" strokeWidth="2" strokeLinejoin="round" />
                <path d="M24 12 V26" stroke="#78350f" strokeWidth="1.5" />
            </g>
            <path
                d="M16 8 q8 -6 16 0"
                fill="none"
                stroke="#fde68a"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ animation: 'logo-fade 2.4s ease-in-out infinite' }}
            />
        </svg>
    );
}

export function MemoryLogo({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className}>
            <g style={{ transformOrigin: '16px 24px', animation: 'logo-flip 2.6s ease-in-out infinite' }}>
                <rect x="6" y="12" width="20" height="24" rx="3" fill="#dc2626" stroke="#fde68a" strokeWidth="1.5" />
            </g>
            <g style={{ transformOrigin: '32px 24px', animation: 'logo-flip 2.6s ease-in-out infinite 1.3s' }}>
                <rect x="22" y="12" width="20" height="24" rx="3" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
            </g>
        </svg>
    );
}

export function PuzzleLogo({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className}>
            <rect x="6" y="6" width="36" height="36" rx="4" fill="none" stroke="#fde68a" strokeWidth="1.5" opacity="0.5" />
            <g style={{ animation: 'logo-slide 2.2s ease-in-out infinite' }}>
                <path
                    d="M10 10 h10 v4 a3 3 0 1 1 0 6 v4 h-10 v-4 a3 3 0 1 0 0 -6 Z"
                    fill="#f59e0b"
                    stroke="#78350f"
                    strokeWidth="1"
                />
            </g>
            <path
                d="M24 24 h10 v4 a3 3 0 1 1 0 6 v4 h-10 v-4 a3 3 0 1 0 0 -6 Z"
                fill="#dc2626"
                stroke="#78350f"
                strokeWidth="1"
                opacity="0.85"
            />
        </svg>
    );
}

export function StopwatchLogo({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className}>
            <rect x="19" y="2" width="10" height="5" rx="1.5" fill="#fde68a" />
            <circle cx="24" cy="26" r="18" fill="none" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="24" cy="26" r="18" fill="#1a0a12" opacity="0.4" />
            {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                const x1 = 24 + 15 * Math.sin(a);
                const y1 = 26 - 15 * Math.cos(a);
                const x2 = 24 + 17 * Math.sin(a);
                const y2 = 26 - 17 * Math.cos(a);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="1" opacity="0.6" />;
            })}
            <line
                x1="24"
                y1="26"
                x2="24"
                y2="12"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transformOrigin: '24px 26px', animation: 'logo-spin 2s linear infinite' }}
            />
            <circle cx="24" cy="26" r="2.5" fill="#fde68a" />
        </svg>
    );
}

export function SpotMissingLogo({ className = 'h-10 w-10' }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className}>
            <g style={{ transformOrigin: '20px 20px', animation: 'logo-tilt 2.2s ease-in-out infinite' }}>
                <circle cx="20" cy="20" r="13" fill="none" stroke="#f59e0b" strokeWidth="4" />
                <circle cx="20" cy="20" r="13" fill="#1a0a12" opacity="0.3" />
                <path d="M15 20 h10 M20 15 v10" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            </g>
            <line x1="29" y1="29" x2="40" y2="40" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        </svg>
    );
}

/** Shared keyframes for the logos above — injected once, reused by every card. */
export function GameLogoStyles() {
    return (
        <style>{`
            @keyframes logo-spin { to { transform: rotate(360deg); } }
            @keyframes logo-tilt {
                0%, 100% { transform: rotate(-4deg); }
                50% { transform: rotate(4deg); }
            }
            @keyframes logo-fade {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            @keyframes logo-flip {
                0%, 40% { transform: rotateY(0deg); }
                50%, 90% { transform: rotateY(180deg); }
                100% { transform: rotateY(360deg); }
            }
            @keyframes logo-slide {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(3px, 3px); }
            }
        `}</style>
    );
}
