import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

export default function ConfirmDeleteButton({ href, confirmText = 'Delete this item?' }: { href: string; confirmText?: string }) {
    return (
        <button
            type="button"
            onClick={() => {
                if (confirm(confirmText)) {
                    router.delete(href, { preserveScroll: true });
                }
            }}
            className="text-slate-400 transition hover:text-red-600"
            title="Delete"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
