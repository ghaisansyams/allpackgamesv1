import { PropsWithChildren } from 'react';
import { GameLogoStyles } from '@/Components/Kiosk/GameLogos';

/**
 * The shared dark, glass-and-glow backdrop for every screen — the kiosk should never show
 * a plain white or flat-gray page. Ambient color blobs behind a grid texture give the
 * "holographic" depth the brief asked for, independent of whatever sits on top of it.
 */
export default function CosmicBackground({ className = '', children }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={`relative min-h-screen overflow-hidden bg-[#0a0718] ${className}`}>
            {/* Injected once here (not per-screen) so every game's animated logo keeps its
                keyframes even though only one screen is mounted inside this wrapper at a time. */}
            <GameLogoStyles />
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />

            {/* Fixed pixel sizes (not vw/vmin) so these render identically across devices —
                viewport-relative units looked wildly different between a laptop window, an
                iPad simulator, and a real Android tablet (differing CSS viewport/DPR
                handling), sometimes washing the page in color, sometimes barely visible. */}
            <div className="pointer-events-none absolute -left-1/4 -top-1/4 h-[480px] w-[480px] rounded-full bg-fuchsia-700/30 blur-[120px]" />
            <div className="pointer-events-none absolute -right-1/4 top-1/3 h-[440px] w-[440px] rounded-full bg-amber-500/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-[-20%] left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-700/30 blur-[120px]" />

            <div className="relative z-10">{children}</div>
        </div>
    );
}
