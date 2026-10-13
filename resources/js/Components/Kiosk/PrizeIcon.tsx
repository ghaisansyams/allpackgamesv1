/**
 * A custom gold gem/trophy icon built with gradients, not a sourced raster asset — the
 * previous gift-box photo turned out to carry a Vecteezy watermark, so anything pulled from
 * the web here risks the same licensing problem. Drawing it ourselves sidesteps that entirely.
 */
export default function PrizeIcon({ className = 'h-16 w-16' }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
            <defs>
                <linearGradient id="prize-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff7cc" />
                    <stop offset="35%" stopColor="#fcd34d" />
                    <stop offset="70%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="prize-gold-light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <radialGradient id="prize-glow" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </radialGradient>
            </defs>

            <circle cx="50" cy="48" r="46" fill="url(#prize-glow)" />

            {/* Trophy cup */}
            <path
                d="M30 20 h40 v16 c0 14 -9 24 -20 24 s-20 -10 -20 -24 Z"
                fill="url(#prize-gold)"
                stroke="#78350f"
                strokeWidth="1.5"
            />
            <path d="M34 24 h32 v12 c0 10.5 -7 18 -16 18 s-16 -7.5 -16 -18 Z" fill="url(#prize-gold-light)" opacity="0.5" />

            {/* Handles */}
            <path d="M30 24 C 16 24, 16 42, 30 44" fill="none" stroke="url(#prize-gold)" strokeWidth="5" strokeLinecap="round" />
            <path d="M70 24 C 84 24, 84 42, 70 44" fill="none" stroke="url(#prize-gold)" strokeWidth="5" strokeLinecap="round" />

            {/* Stem + base */}
            <rect x="46" y="58" width="8" height="12" fill="url(#prize-gold)" />
            <rect x="36" y="70" width="28" height="6" rx="2" fill="url(#prize-gold)" />
            <rect x="30" y="76" width="40" height="7" rx="2.5" fill="url(#prize-gold)" stroke="#78350f" strokeWidth="1" />

            {/* Star accent */}
            <path
                d="M50 29 l3.2 6.6 7.3 1 -5.3 5.1 1.3 7.3 -6.5 -3.4 -6.5 3.4 1.3 -7.3 -5.3 -5.1 7.3 -1 Z"
                fill="#fff7cc"
                opacity="0.95"
            />
        </svg>
    );
}
