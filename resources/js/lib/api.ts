import type {
    DecisionLabContent,
    DecisionResult,
    DecisionSession,
    WheelContent,
    WheelSpinResult,
    PackagingOptionChoice,
} from '@/types/content';

const api = () => window.axios;

export const ContentApi = {
    decisionLab: () => api().get<DecisionLabContent>('/api/content/decision-lab').then((r) => r.data),
    wheel: () => api().get<WheelContent>('/api/content/wheel').then((r) => r.data),
};

export const BoothSessionApi = {
    create: () => api().post<{ token: string }>('/api/booth-sessions').then((r) => r.data.token),

    status: (token: string) =>
        api()
            .get<{ status: 'waiting' | 'claimed'; visitor_id: number | null }>(`/api/booth-sessions/${token}`)
            .then((r) => r.data),
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

    handoff: (sessionId: number, type: 'email' | 'expert'): Promise<{ ok: boolean; message?: string }> =>
        api()
            .post(`/api/decision-sessions/${sessionId}/handoff`, { type })
            .then(() => ({ ok: true }))
            .catch((error) => ({
                ok: false,
                message: error.response?.data?.message ?? 'Something went wrong. Please try again.',
            })),
};

export const MiniGameApi = {
    record: (
        game: 'memory_card' | 'puzzle' | 'stopwatch' | 'packaging_rush',
        won: boolean,
        visitorId?: number | null,
        meta?: Record<string, unknown>,
    ) =>
        api().post('/api/mini-game-attempts', { game, won, visitor_id: visitorId, meta }),
};

export const WheelApi = {
    spin: (visitorId?: number | null) =>
        api()
            .post<{ spin: WheelSpinResult }>('/api/wheel/spins', { visitor_id: visitorId })
            .then((r) => r.data.spin),

    handoff: (spinId: number, visitorId?: number | null) =>
        api().post(`/api/wheel/spins/${spinId}/handoff`, { visitor_id: visitorId }),
};
