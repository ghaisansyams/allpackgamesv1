import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import FlashBanner from '@/Components/Admin/FlashBanner';
import Icon from '@/lib/icons';
import { Save } from 'lucide-react';

interface WheelSegmentRow {
    id: number;
    outcome: 'win' | 'bomb';
    reward_label: string | null;
    message: string;
    sort_order: number;
}

export default function Index({ wheelSegments }: { wheelSegments: WheelSegmentRow[] }) {
    const winCount = wheelSegments.filter((s) => s.outcome === 'win').length;

    return (
        <AdminLayout title="Wheel Wedges">
            <Head title="Wheel Wedges" />
            <FlashBanner />

            <div className="mb-4 flex items-center justify-between">
                <p className="max-w-2xl text-sm text-slate-500">
                    The Digital Wheel always has exactly 8 physical wedges, every one rendered identically as a
                    mystery box on the touch screen. Edit each wedge's outcome, reward, and message below — wedges
                    can't be added or removed, since that would change the fixed 1-in-8 odds.
                </p>
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        winCount === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {winCount} winning wedge{winCount === 1 ? '' : 's'} of 8
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {wheelSegments.map((segment) => (
                    <WheelSegmentCard key={segment.id} segment={segment} />
                ))}
            </div>
        </AdminLayout>
    );
}

function WheelSegmentCard({ segment }: { segment: WheelSegmentRow }) {
    const form = useForm({
        outcome: segment.outcome,
        reward_label: segment.reward_label ?? '',
        message: segment.message,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.put(route('admin.wheel-segments.update', segment.id), { preserveScroll: true });
    }

    return (
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="star" className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-900">Wedge #{segment.sort_order}</span>
                </div>
                <select
                    value={form.data.outcome}
                    onChange={(e) => form.setData('outcome', e.target.value as 'win' | 'bomb')}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-bold focus:ring-2 focus:ring-emerald-500 ${
                        form.data.outcome === 'win' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-800 text-white'
                    }`}
                >
                    <option value="bomb">Bomb</option>
                    <option value="win">Win</option>
                </select>
            </div>

            {form.data.outcome === 'win' && (
                <div className="mb-3">
                    <label className="text-xs font-semibold text-slate-600">Reward Label</label>
                    <input
                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={form.data.reward_label}
                        onChange={(e) => form.setData('reward_label', e.target.value)}
                        placeholder="ALLPACK Prize"
                    />
                </div>
            )}

            <div className="mb-3">
                <label className="text-xs font-semibold text-slate-600">Message</label>
                <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    rows={2}
                    value={form.data.message}
                    onChange={(e) => form.setData('message', e.target.value)}
                />
                <InputError message={form.errors.message} className="mt-1" />
                <InputError message={form.errors.outcome} className="mt-1" />
            </div>

            <button
                type="submit"
                disabled={form.processing}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
            >
                <Save className="h-3.5 w-3.5" /> Save
            </button>
        </form>
    );
}
