import { Head } from '@inertiajs/react';
import { PartyPopper } from 'lucide-react';
import CosmicBackground from '@/Components/Kiosk/CosmicBackground';

export default function JoinThanks() {
    return (
        <CosmicBackground>
            <Head title="ALLPACK 2026 — You're In!" />
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                <PartyPopper className="h-20 w-20 animate-bounce text-amber-400" strokeWidth={1.5} />
                <h1 className="font-display text-2xl font-black uppercase text-white">You're All Set!</h1>
                <p className="max-w-xs text-slate-300">Look back at the booth screen — your game choices are ready for you there.</p>
            </div>
        </CosmicBackground>
    );
}
