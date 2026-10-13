import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Mascot from '@/Components/Kiosk/Mascot';

const INDUSTRIES = ['Food & Beverage', 'Pharmaceutical', 'Cosmetic / Personal Care', 'Packaging', 'Manufacturing', 'Other'];

export default function Join({ token, alreadyClaimed }: { token: string; alreadyClaimed: boolean }) {
    const [industry, setIndustry] = useState('');
    const form = useForm({
        name: '',
        company: '',
        job_title: '',
        contact: '',
        industry: '',
        industry_other: '',
    });

    const isValid =
        form.data.name && form.data.company && form.data.job_title && form.data.contact && industry &&
        (industry !== 'Other' || form.data.industry_other);

    function selectIndustry(value: string) {
        setIndustry(value);
        form.setData('industry', value);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        if (isValid) {
            form.post(`/join/${token}`);
        }
    }

    if (alreadyClaimed) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
                <Head title="ALLPACK — Join" />
                <Mascot pose="shock" className="h-28" />
                <h1 className="text-xl font-black text-slate-900">This QR code has already been used</h1>
                <p className="text-slate-500">Ask the booth crew to show you a fresh QR code on the screen.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-5 py-8">
            <Head title="ALLPACK 2026 — Join" />

            <div className="mx-auto max-w-md">
                <div className="mb-6 text-center">
                    <Mascot pose="wave" className="mx-auto h-24" />
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-emerald-700">ALLPACK 2026</p>
                    <h1 className="text-2xl font-black text-slate-900">Let's Get Started!</h1>
                    <p className="mt-1 text-sm text-slate-500">Fill in your details, then look back at the booth screen.</p>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    <Field
                        placeholder="Full Name"
                        value={form.data.name}
                        onChange={(v) => form.setData('name', v)}
                        error={form.errors.name}
                    />
                    <Field
                        placeholder="Company"
                        value={form.data.company}
                        onChange={(v) => form.setData('company', v)}
                        error={form.errors.company}
                    />
                    <Field
                        placeholder="Job Title / Position"
                        value={form.data.job_title}
                        onChange={(v) => form.setData('job_title', v)}
                        error={form.errors.job_title}
                    />
                    <Field
                        placeholder="WhatsApp or Email"
                        value={form.data.contact}
                        onChange={(v) => form.setData('contact', v)}
                        error={form.errors.contact}
                    />

                    <p className="pt-2 text-xs font-bold uppercase tracking-widest text-emerald-700">Industry</p>
                    <div className="grid grid-cols-2 gap-2">
                        {INDUSTRIES.map((opt) => (
                            <button
                                type="button"
                                key={opt}
                                onClick={() => selectIndustry(opt)}
                                className={`min-h-[52px] rounded-xl border-2 px-3 text-sm font-semibold ${
                                    industry === opt
                                        ? 'border-amber-500 bg-amber-50 text-slate-900'
                                        : 'border-slate-200 bg-white text-slate-600'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {industry === 'Other' && (
                        <Field
                            placeholder="Please specify your industry"
                            value={form.data.industry_other}
                            onChange={(v) => form.setData('industry_other', v)}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={!isValid || form.processing}
                        className="mt-4 min-h-[56px] w-full rounded-xl bg-emerald-700 text-lg font-bold text-white disabled:opacity-40"
                    >
                        {form.processing ? 'Submitting…' : "Let's Play!"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Field({
    placeholder,
    value,
    onChange,
    error,
}: {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
}) {
    return (
        <div>
            <input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[52px] w-full rounded-xl border-2 border-slate-200 px-4 text-base focus:border-emerald-500 focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
