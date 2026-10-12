export default function ScoreDots({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium capitalize text-slate-700">{label.replace('_', ' ')}</span>
            <span className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <span
                        key={i}
                        className={`h-3 w-3 rounded-full ${i < value ? 'bg-emerald-600' : 'bg-slate-200'}`}
                    />
                ))}
            </span>
        </div>
    );
}
