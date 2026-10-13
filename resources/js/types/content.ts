export type PrioritySlug =
    | 'protection'
    | 'shelf_life'
    | 'cost'
    | 'sustainability'
    | 'convenience'
    | 'presentation';

export interface BusinessCase {
    id: number;
    slug: string;
    title: string;
    description: string;
    icon: string;
}

export interface Market {
    id: number;
    slug: string;
    title: string;
    description: string;
}

export interface Priority {
    id: number;
    slug: PrioritySlug;
    title: string;
    description: string;
    icon: string;
}

export interface DecisionLabContent {
    business_cases: BusinessCase[];
    markets: Market[];
    priorities: Priority[];
}

export interface PackagingOptionChoice {
    id: number;
    label: string;
    description: string;
    scores: Record<PrioritySlug, number>;
}

export interface Visitor {
    id: number;
    name: string;
    company: string;
    job_title: string;
    contact: string;
    industry: string;
    industry_other?: string | null;
}

export interface DecisionSession {
    id: number;
    visitor_id: number | null;
    business_case_id: number | null;
    market_slug: string | null;
    priority_1_slug: string | null;
    priority_2_slug: string | null;
    priority_3_slug: string | null;
    packaging_option_id: number | null;
    weighted_score: number | null;
    fit_score: number | null;
    profile: string | null;
    strength: string | null;
    trade_off: string | null;
    completed_at: string | null;
}

export interface DecisionResult {
    weighted_score: number;
    fit_score: number;
    profile: string;
    strength: string;
    trade_off: string;
    solution_label: string;
}

export type WheelOutcome = 'win' | 'bomb';

export interface WheelSegmentSummary {
    id: number;
    sort_order: number;
    outcome: WheelOutcome;
    reward_label: string | null;
}

export interface WheelContent {
    segments: WheelSegmentSummary[];
}

export interface WheelSpinResult {
    id: number;
    sort_order: number;
    outcome: WheelOutcome;
    reward_label: string | null;
    message: string;
}
