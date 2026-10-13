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
import Icon from '@/lib/icons';
import { Plus, Pencil } from 'lucide-react';

interface PriorityRow {
    id: number;
    slug: string;
    title: string;
    description: string;
    icon: string;
    sort_order: number;
}

const ICON_OPTIONS = ['shield', 'hourglass', 'coins', 'leaf', 'hand', 'star'];

export default function Index({ priorities }: { priorities: PriorityRow[] }) {
    const [editing, setEditing] = useState<PriorityRow | null>(null);
    const [showForm, setShowForm] = useState(false);

    const form = useForm({ slug: '', title: '', description: '', icon: 'shield', sort_order: priorities.length + 1 });

    function openCreate() {
        form.clearErrors();
        form.setData({ slug: '', title: '', description: '', icon: 'shield', sort_order: priorities.length + 1 });
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(row: PriorityRow) {
        form.clearErrors();
        form.setData({ slug: row.slug, title: row.title, description: row.description, icon: row.icon, sort_order: row.sort_order });
        setEditing(row);
        setShowForm(true);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(route('admin.priorities.update', editing.id), { onSuccess: () => setShowForm(false) });
        } else {
            form.post(route('admin.priorities.store'), { onSuccess: () => setShowForm(false) });
        }
    }

    return (
        <AdminLayout title="Priorities">
            <Head title="Priorities" />
            <FlashBanner />

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    The six priority factors offered at Stage 5 — these slugs must exactly match the keys used in every packaging option's scores.
                </p>
                <button
                    onClick={openCreate}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                    <Plus className="h-4 w-4" /> Add Priority
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-5 py-3">Order</th>
                            <th className="px-5 py-3">Icon</th>
                            <th className="px-5 py-3">Title</th>
                            <th className="px-5 py-3">Slug</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {priorities.map((row) => (
                            <tr key={row.id}>
                                <td className="px-5 py-3 text-slate-500">{row.sort_order}</td>
                                <td className="px-5 py-3">
                                    <Icon name={row.icon} className="h-5 w-5 text-emerald-700" />
                                </td>
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
                                            href={route('admin.priorities.destroy', row.id)}
                                            confirmText={`Delete "${row.title}"? Packaging options referencing this slug will lose that score.`}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {priorities.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                                    No priorities yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showForm} onClose={() => setShowForm(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900">{editing ? 'Edit Priority' : 'Add Priority'}</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Title" />
                            <TextInput className="mt-1 block w-full" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                            <InputError message={form.errors.title} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Slug" />
                            <TextInput className="mt-1 block w-full font-mono text-sm" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} placeholder="protection" />
                            <InputError message={form.errors.slug} className="mt-1" />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel value="Description" />
                            <TextInput className="mt-1 block w-full" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            <InputError message={form.errors.description} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Icon" />
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                value={form.data.icon}
                                onChange={(e) => form.setData('icon', e.target.value)}
                            >
                                {ICON_OPTIONS.map((icon) => (
                                    <option key={icon} value={icon}>
                                        {icon}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.icon} className="mt-1" />
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
