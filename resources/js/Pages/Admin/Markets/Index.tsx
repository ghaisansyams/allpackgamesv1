import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FlashBanner from '@/Components/Admin/FlashBanner';
import ConfirmDeleteButton from '@/Components/Admin/ConfirmDeleteButton';
import { Plus, Pencil } from 'lucide-react';

interface MarketRow {
    id: number;
    slug: string;
    title: string;
    description: string;
    sort_order: number;
}

export default function Index({ markets }: { markets: MarketRow[] }) {
    const [editing, setEditing] = useState<MarketRow | null>(null);
    const [showForm, setShowForm] = useState(false);

    const form = useForm({ slug: '', title: '', description: '', sort_order: markets.length + 1 });

    function openCreate() {
        form.clearErrors();
        form.setData({ slug: '', title: '', description: '', sort_order: markets.length + 1 });
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(row: MarketRow) {
        form.clearErrors();
        form.setData({ slug: row.slug, title: row.title, description: row.description, sort_order: row.sort_order });
        setEditing(row);
        setShowForm(true);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(route('admin.markets.update', editing.id), { onSuccess: () => setShowForm(false) });
        } else {
            form.post(route('admin.markets.store'), { onSuccess: () => setShowForm(false) });
        }
    }

    return (
        <AdminLayout title="Markets">
            <Head title="Markets" />
            <FlashBanner />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">Distribution channels offered at Stage 4 of the Packaging Decision Lab.</p>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                    <Plus className="h-4 w-4" /> Add Market
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-5 py-3">Order</th>
                            <th className="px-5 py-3">Title</th>
                            <th className="px-5 py-3">Slug</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {markets.map((row) => (
                            <tr key={row.id}>
                                <td className="px-5 py-3 text-slate-500">{row.sort_order}</td>
                                <td className="px-5 py-3 font-semibold text-slate-900">
                                    {row.title}
                                    <p className="font-normal text-slate-500">{row.description}</p>
                                </td>
                                <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.slug}</td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-3">
                                        <button onClick={() => openEdit(row)} className="text-slate-400 hover:text-emerald-700">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <ConfirmDeleteButton
                                            href={route('admin.markets.destroy', row.id)}
                                            confirmText={`Delete "${row.title}"?`}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {markets.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                                    No markets yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showForm} onClose={() => setShowForm(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900">{editing ? 'Edit Market' : 'Add Market'}</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Title" />
                            <TextInput className="mt-1 block w-full" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                            <InputError message={form.errors.title} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Slug" />
                            <TextInput className="mt-1 block w-full font-mono text-sm" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} placeholder="retail" />
                            <InputError message={form.errors.slug} className="mt-1" />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Description" />
                            <TextInput className="mt-1 block w-full" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            <InputError message={form.errors.description} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Sort Order" />
                            <TextInput type="number" className="mt-1 block w-full" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} />
                            <InputError message={form.errors.sort_order} className="mt-1" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold text-slate-500">
                            Cancel
                        </button>
                        <PrimaryButton disabled={form.processing}>{editing ? 'Save Changes' : 'Create'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
