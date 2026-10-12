import { FormEvent, useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import StepHeader from '@/Components/Kiosk/StepHeader';

const INDUSTRIES = ['Food & Beverage', 'Pharmaceutical', 'Cosmetic / Personal Care', 'Packaging', 'Manufacturing', 'Other'];

export interface VisitorFormData {
    name: string;
    company: string;
    job_title: string;
    contact: string;
    industry: string;
    industry_other?: string;
}

export default function VisitorDataStage({
    onSubmit,
    submitting,
}: {
    onSubmit: (data: VisitorFormData) => void;
    submitting: boolean;
}) {
    const [form, setForm] = useState<VisitorFormData>({
        name: '',
        company: '',
        job_title: '',
        contact: '',
        industry: '',
        industry_other: '',
    });

    const isValid = form.name && form.company && form.job_title && form.contact && form.industry
        && (form.industry !== 'Other' || form.industry_other);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (isValid) {
            onSubmit(form);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
            <StepHeader step={1} total={7} title="Visitor Data" subtitle="Tell us a bit about yourself to get started." />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="min-h-[56px] rounded-xl border-2 border-slate-200 px-4 text-lg focus:border-emerald-500 focus:outline-none sm:col-span-2"
                />
                <input
                    required
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="min-h-[56px] rounded-xl border-2 border-slate-200 px-4 text-lg focus:border-emerald-500 focus:outline-none"
                />
                <input
                    required
                    placeholder="Job Title / Position"
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    className="min-h-[56px] rounded-xl border-2 border-slate-200 px-4 text-lg focus:border-emerald-500 focus:outline-none"
                />
                <input
                    required
                    placeholder="WhatsApp or Email"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="min-h-[56px] rounded-xl border-2 border-slate-200 px-4 text-lg focus:border-emerald-500 focus:outline-none sm:col-span-2"
                />
            </div>

            <p className="mb-3 mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">Industry</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INDUSTRIES.map((industry) => (
                    <button
                        type="button"
                        key={industry}
                        onClick={() => setForm({ ...form, industry })}
                        className={`min-h-[56px] rounded-xl border-2 px-3 text-sm font-semibold transition active:scale-95 ${
                            form.industry === industry
                                ? 'border-amber-500 bg-amber-50 text-slate-900'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400'
                        }`}
                    >
                        {industry}
                    </button>
                ))}
            </div>

            {form.industry === 'Other' && (
                <input
                    placeholder="Please specify your industry"
                    value={form.industry_other}
                    onChange={(e) => setForm({ ...form, industry_other: e.target.value })}
                    className="mt-3 min-h-[56px] w-full rounded-xl border-2 border-slate-200 px-4 text-lg focus:border-emerald-500 focus:outline-none"
                />
            )}

            <div className="mt-8 flex justify-end">
                <TouchButton type="submit" disabled={!isValid || submitting}>
                    {submitting ? 'Please wait…' : 'Continue'}
                </TouchButton>
            </div>
        </form>
    );
}
