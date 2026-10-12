import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
    primary: 'bg-amber-500 text-slate-900 hover:bg-amber-400 active:bg-amber-600',
    secondary: 'bg-emerald-700 text-white hover:bg-emerald-600 active:bg-emerald-800',
    ghost: 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30 border border-white/30',
};

export default function TouchButton({
    children,
    variant = 'primary',
    className = '',
    ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>) {
    return (
        <button
            {...props}
            className={`min-h-[64px] rounded-2xl px-8 py-4 text-xl font-bold tracking-wide shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
