import { usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function FlashBanner() {
    const { flash } = usePage().props;

    if (!flash?.success) {
        return null;
    }

    return (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{flash.success}</span>
        </div>
    );
}
