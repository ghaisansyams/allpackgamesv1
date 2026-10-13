import { Head } from '@inertiajs/react';
import { PartyPopper } from 'lucide-react';

export default function JoinThanks() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-emerald-50 to-white px-6 text-center">
            <Head title="ALLPACK 2026 — You're In!" />
            <PartyPopper className="h-20 w-20 animate-bounce text-amber-500" strokeWidth={1.5} />
            <h1 className="text-2xl font-black text-slate-900">You're All Set!</h1>
            <p className="max-w-xs text-slate-500">Look back at the booth screen — your game choices are ready for you there.</p>
        </div>
    );
}
