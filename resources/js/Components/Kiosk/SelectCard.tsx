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
            className={`flex min-h-[140px] flex-col items-start gap-2 rounded-2xl border-2 p-6 text-left shadow-md transition active:scale-95 ${
                selected
                    ? 'border-amber-500 bg-amber-50 ring-4 ring-amber-200'
                    : 'border-slate-200 bg-white hover:border-emerald-400'
            }`}
        >
            {children}
            <span className="text-lg font-bold text-slate-900">{title}</span>
            {description && <span className="text-sm text-slate-600">{description}</span>}
        </button>
    );
}
