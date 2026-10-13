import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
    primary:
        'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 text-amber-950 border border-amber-200/60 shadow-[0_0_30px_rgba(245,158,11,0.55)] hover:brightness-110 active:brightness-95',
    secondary:
        'bg-gradient-to-b from-rose-500 via-red-600 to-red-800 text-white border border-rose-300/50 shadow-[0_0_30px_rgba(225,29,72,0.55)] hover:brightness-110 active:brightness-95',
    ghost: 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:bg-white/30 border border-white/30',
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
            className={`min-h-[64px] rounded-2xl px-8 py-4 font-display text-xl font-bold uppercase tracking-wide transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
