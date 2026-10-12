import { useEffect, useState } from 'react';
import TouchButton from '@/Components/Kiosk/TouchButton';
import StepHeader from '@/Components/Kiosk/StepHeader';
import SelectCard from '@/Components/Kiosk/SelectCard';
import ScoreDots from '@/Components/Kiosk/ScoreDots';
import CountdownBar from '@/Components/Kiosk/CountdownBar';
import Icon from '@/lib/icons';
import { ContentApi, DecisionSessionApi, VisitorApi } from '@/lib/api';
import VisitorDataStage, { VisitorFormData } from './VisitorDataStage';
import ResultStage from './ResultStage';
import type {
    BusinessCase,
    DecisionLabContent,
    DecisionResult,
    Market,
    PackagingOptionChoice,
    Priority,
    PrioritySlug,
} from '@/types/content';

type Stage = 'loading' | 'visitor' | 'start' | 'business_case' | 'market' | 'priorities' | 'decision' | 'result';

// Generic packaging product cutouts, assigned by option position (A/B/C) rather than by
// business case content — a placeholder visual treatment until case-specific photography exists.
const OPTION_IMAGES = ['/images/packaging/option-a.png', '/images/packaging/option-b.png', '/images/packaging/option-c.png'];

export default function DecisionLabExperience({ onExit }: { onExit: () => void }) {
    const [stage, setStage] = useState<Stage>('loading');
    const [content, setContent] = useState<DecisionLabContent | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [visitorId, setVisitorId] = useState<number | null>(null);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [businessCase, setBusinessCase] = useState<BusinessCase | null>(null);
    const [market, setMarket] = useState<Market | null>(null);
    const [priorities, setPriorities] = useState<PrioritySlug[]>([]);
    const [options, setOptions] = useState<PackagingOptionChoice[] | null>(null);
    const [result, setResult] = useState<DecisionResult | null>(null);

    useEffect(() => {
        ContentApi.decisionLab()
            .then((data) => {
                setContent(data);
                setStage('visitor');
            })
            .catch(() => setError('Unable to load content. Please check the connection.'));
    }, []);

    async function handleVisitorSubmit(form: VisitorFormData) {
        setSubmitting(true);
        setError(null);
        try {
            const visitor = await VisitorApi.create(form);
            const session = await DecisionSessionApi.create(visitor.id);
            setVisitorId(visitor.id);
            setSessionId(session.id);
            setStage('start');
        } catch {
            setError('Something went wrong saving your details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleBusinessCaseSelect(bc: BusinessCase) {
        if (!sessionId) return;
        setBusinessCase(bc);
        await DecisionSessionApi.update(sessionId, { business_case_id: bc.id });
        setStage('market');
    }

    async function handleMarketSelect(m: Market) {
        if (!sessionId) return;
        setMarket(m);
        await DecisionSessionApi.update(sessionId, { market_slug: m.slug });
        setStage('priorities');
    }

    function togglePriority(slug: PrioritySlug) {
        setPriorities((prev) => {
            if (prev.includes(slug)) {
                return prev.filter((p) => p !== slug);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, slug];
        });
    }

    async function handlePrioritiesConfirm() {
        if (!sessionId || priorities.length !== 3) return;
        setSubmitting(true);
        try {
            await DecisionSessionApi.update(sessionId, {
                priority_1_slug: priorities[0],
                priority_2_slug: priorities[1],
                priority_3_slug: priorities[2],
            });
            const fetchedOptions = await DecisionSessionApi.options(sessionId);
            setOptions(fetchedOptions);
            setStage('decision');
        } catch {
            setError('Unable to load packaging options. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDecide(optionId: number) {
        if (!sessionId) return;
        setSubmitting(true);
        try {
            const { result: decisionResult } = await DecisionSessionApi.decide(sessionId, optionId);
            setResult(decisionResult);
            setStage('result');
        } catch {
            setError('Unable to compute your result. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    function restart() {
        setStage('visitor');
        setVisitorId(null);
        setSessionId(null);
        setBusinessCase(null);
        setMarket(null);
        setPriorities([]);
        setOptions(null);
        setResult(null);
        onExit();
    }

    if (stage === 'loading' || !content) {
        return <CenteredMessage text={error ?? 'Loading experience…'} />;
    }

    return (
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center px-6 py-10">
            {error && (
                <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-red-700">{error}</p>
            )}

            {stage !== 'result' && <CountdownBar totalSeconds={180} dangerSeconds={25} />}

            {stage === 'visitor' && (
                <VisitorDataStage onSubmit={handleVisitorSubmit} submitting={submitting} />
            )}

            {stage === 'start' && (
                <div className="mx-auto max-w-2xl rounded-3xl bg-slate-900 p-10 text-center text-white shadow-2xl">
                    <h2 className="text-3xl font-black">What Kind of Packaging Challenge Can You Solve?</h2>
                    <p className="mt-3 text-slate-300">You have approximately 2–3 minutes to make your decision.</p>
                    <TouchButton className="mt-8" onClick={() => setStage('business_case')}>
                        ▶ Start Challenge
                    </TouchButton>
                </div>
            )}

            {stage === 'business_case' && (
                <div>
                    <StepHeader step={3} total={7} title="Choose Your Business Case" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {content.business_cases.map((bc) => (
                            <SelectCard
                                key={bc.id}
                                title={bc.title}
                                description={bc.description}
                                selected={businessCase?.id === bc.id}
                                onClick={() => handleBusinessCaseSelect(bc)}
                            >
                                <Icon name={bc.icon} className="h-9 w-9 text-emerald-700" />
                            </SelectCard>
                        ))}
                    </div>
                </div>
            )}

            {stage === 'market' && (
                <div>
                    <StepHeader step={4} total={7} title="Define Your Market" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {content.markets.map((m) => (
                            <SelectCard
                                key={m.id}
                                title={m.title}
                                description={m.description}
                                selected={market?.id === m.id}
                                onClick={() => handleMarketSelect(m)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {stage === 'priorities' && (
                <div>
                    <StepHeader
                        step={5}
                        total={7}
                        title="Set Your Top 3 Priorities"
                        subtitle="Tap in order of importance — do not rank all six."
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {content.priorities.map((p: Priority) => {
                            const rank = priorities.indexOf(p.slug);
                            return (
                                <SelectCard
                                    key={p.id}
                                    title={p.title}
                                    description={p.description}
                                    selected={rank !== -1}
                                    onClick={() => togglePriority(p.slug)}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <Icon name={p.icon} className="h-9 w-9 text-emerald-700" />
                                        {rank !== -1 && (
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-900">
                                                {rank + 1}
                                            </span>
                                        )}
                                    </div>
                                </SelectCard>
                            );
                        })}
                    </div>
                    <div className="mt-8 flex justify-end">
                        <TouchButton disabled={priorities.length !== 3 || submitting} onClick={handlePrioritiesConfirm}>
                            {submitting ? 'Loading options…' : 'Continue'}
                        </TouchButton>
                    </div>
                </div>
            )}

            {stage === 'decision' && options && (
                <div>
                    <StepHeader step={6} total={7} title="Make Your Packaging Decision" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {options.map((option, i) => (
                            <div key={option.id} className="flex flex-col gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 shadow">
                                <img
                                    src={OPTION_IMAGES[i % OPTION_IMAGES.length]}
                                    alt=""
                                    className="h-32 w-full object-contain"
                                />
                                <div>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <p className="mt-2 font-bold text-slate-900">{option.label}</p>
                                    <p className="text-sm text-slate-600">{option.description}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {priorities.map((slug) => (
                                        <ScoreDots key={slug} label={slug} value={option.scores[slug]} />
                                    ))}
                                </div>
                                <TouchButton
                                    variant="secondary"
                                    className="mt-auto"
                                    disabled={submitting}
                                    onClick={() => handleDecide(option.id)}
                                >
                                    Choose This
                                </TouchButton>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {stage === 'result' && result && sessionId && (
                <ResultStage
                    result={result}
                    onSendEmail={() => DecisionSessionApi.handoff(sessionId, 'email').then(() => undefined)}
                    onTalkToExpert={() => DecisionSessionApi.handoff(sessionId, 'expert').then(() => undefined)}
                    onRestart={restart}
                />
            )}
        </div>
    );
}

function CenteredMessage({ text }: { text: string }) {
    return (
        <div className="flex min-h-full items-center justify-center">
            <p className="text-xl text-slate-500">{text}</p>
        </div>
    );
}
