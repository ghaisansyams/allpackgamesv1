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
                        className={`h-2 flex-1 rounded-full ${i < step ? 'bg-amber-500' : 'bg-slate-200'}`}
                    />
                ))}
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Step {step} of {total}
            </p>
            <h2 className="text-3xl font-black text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        </div>
    );
}
