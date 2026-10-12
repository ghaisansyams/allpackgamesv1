import type {
    DecisionLabContent,
    DecisionResult,
    DecisionSession,
    Visitor,
    WheelAnswerResult,
    WheelContent,
    WheelSpinResult,
    PackagingOptionChoice,
} from '@/types/content';

const api = () => window.axios;

export const ContentApi = {
    decisionLab: () => api().get<DecisionLabContent>('/api/content/decision-lab').then((r) => r.data),
    wheel: () => api().get<WheelContent>('/api/content/wheel').then((r) => r.data),
};

export const VisitorApi = {
    create: (data: {
        name: string;
        company: string;
        job_title: string;
        contact: string;
        industry: string;
        industry_other?: string;
    }) => api().post<{ visitor: Visitor }>('/api/visitors', data).then((r) => r.data.visitor),
};

export const DecisionSessionApi = {
    create: (visitorId?: number) =>
        api()
            .post<{ session: DecisionSession }>('/api/decision-sessions', { visitor_id: visitorId })
            .then((r) => r.data.session),

    update: (sessionId: number, data: Partial<DecisionSession>) =>
        api()
            .patch<{ session: DecisionSession }>(`/api/decision-sessions/${sessionId}`, data)
            .then((r) => r.data.session),

    options: (sessionId: number) =>
        api()
            .get<{ options: PackagingOptionChoice[] }>(`/api/decision-sessions/${sessionId}/options`)
            .then((r) => r.data.options),

    decide: (sessionId: number, packagingOptionId: number) =>
        api()
            .post<{ session: DecisionSession; result: DecisionResult }>(
                `/api/decision-sessions/${sessionId}/decision`,
                { packaging_option_id: packagingOptionId },
            )
            .then((r) => r.data),

    handoff: (sessionId: number, type: 'email' | 'expert') =>
        api().post(`/api/decision-sessions/${sessionId}/handoff`, { type }),
};

export const WheelApi = {
    spin: (visitorId?: number) =>
        api()
            .post<{ spin: WheelSpinResult }>('/api/wheel/spins', { visitor_id: visitorId })
            .then((r) => r.data.spin),

    answer: (spinId: number, selectedIndex: number) =>
        api()
            .post<WheelAnswerResult>(`/api/wheel/spins/${spinId}/answer`, { selected_index: selectedIndex })
            .then((r) => r.data),

    handoff: (
        spinId: number,
        data: { visitor_id?: number; name?: string; company?: string; job_title?: string; contact?: string; industry?: string },
    ) => api().post(`/api/wheel/spins/${spinId}/handoff`, data),
};
