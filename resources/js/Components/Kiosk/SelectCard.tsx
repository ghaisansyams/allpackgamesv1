import { PropsWithChildren } from 'react';

export default function SelectCard({
    title,
    description,
    selected = false,
    onClick,
    children,
}: PropsWithChildren<{
    title: string;
    description?: string;
    selected?: boolean;
    onClick: () => void;
}>) {
    return (
        <button
            onClick={onClick}
            className={`flex min-h-[140px] flex-col items-start gap-2 rounded-2xl border p-6 text-left backdrop-blur-xl transition active:scale-95 ${
                selected
                    ? 'border-amber-400 bg-amber-400/15 shadow-[0_0_24px_rgba(245,158,11,0.45)]'
                    : 'border-white/15 bg-white/[0.06] hover:border-amber-300/50 hover:bg-white/[0.1]'
            }`}
        >
            {children}
            <span className="font-display text-lg font-bold text-white">{title}</span>
            {description && <span className="text-sm text-slate-300">{description}</span>}
        </button>
    );
}
