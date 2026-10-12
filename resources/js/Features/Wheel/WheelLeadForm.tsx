import { FormEvent, useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';

export default function WheelLeadForm({
    onSubmit,
    submitting,
}: {
    onSubmit: (data: { name: string; company: string; job_title: string; contact: string }) => void;
    submitting: boolean;
}) {
    const [form, setForm] = useState({ name: '', company: '', job_title: '', contact: '' });
    const isValid = form.name && form.contact;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (isValid) {
            onSubmit(form);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
            <h2 className="mb-1 text-2xl font-black text-amber-400">Almost there!</h2>
            <p className="mb-6 text-slate-300">Leave your details so our team can follow up.</p>
            <div className="grid grid-cols-1 gap-3">
                <input
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="min-h-[52px] rounded-xl border-2 border-white/20 bg-white/10 px-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
                <input
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="min-h-[52px] rounded-xl border-2 border-white/20 bg-white/10 px-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
                <input
                    placeholder="Job Title"
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    className="min-h-[52px] rounded-xl border-2 border-white/20 bg-white/10 px-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
                <input
                    required
                    placeholder="WhatsApp or Email"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="min-h-[52px] rounded-xl border-2 border-white/20 bg-white/10 px-4 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
            </div>
            <TouchButton type="submit" className="mt-6 w-full" disabled={!isValid || submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
            </TouchButton>
        </form>
    );
}
