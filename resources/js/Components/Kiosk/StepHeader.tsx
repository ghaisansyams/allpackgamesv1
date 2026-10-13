export default function StepHeader({
    step,
    total,
    title,
    subtitle,
}: {
    step: number;
    total: number;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-8">
            <div className="mb-3 flex gap-2">
                {Array.from({ length: total }, (_, i) => (
                    <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                            i < step ? 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.7)]' : 'bg-white/10'
                        }`}
                    />
                ))}
            </div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-amber-400">
                Step {step} of {total}
            </p>
            <h2 className="font-display text-3xl font-black text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-300">{subtitle}</p>}
        </div>
    );
}
