<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DecisionSession;
use App\Models\PackagingOption;
use App\Models\Visitor;
use App\Services\PackagingScoringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DecisionSessionController extends Controller
{
    public function __construct(private readonly PackagingScoringService $scoringService) {}

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => ['nullable', 'exists:visitors,id'],
        ]);

        $session = DecisionSession::create($data);

        return response()->json(['session' => $session], 201);
    }

    public function update(Request $request, DecisionSession $decisionSession): JsonResponse
    {
        $data = $request->validate([
            'business_case_id' => ['sometimes', 'exists:business_cases,id'],
            'market_slug' => ['sometimes', 'exists:markets,slug'],
            'priority_1_slug' => ['sometimes', 'exists:priorities,slug'],
            'priority_2_slug' => ['sometimes', 'exists:priorities,slug', 'different:priority_1_slug'],
            'priority_3_slug' => ['sometimes', 'exists:priorities,slug', 'different:priority_1_slug', 'different:priority_2_slug'],
        ]);

        $decisionSession->update($data);

        return response()->json(['session' => $decisionSession->fresh()]);
    }

    /**
     * Three packaging options for the session's business case, filtered by market when the
     * option is restricted to specific markets.
     */
    public function options(DecisionSession $decisionSession): JsonResponse
    {
        $options = PackagingOption::query()
            ->where('business_case_id', $decisionSession->business_case_id)
            ->orderBy('sort_order')
            ->get(['id', 'label', 'description', 'applicable_markets', 'scores']);

        $marketFiltered = $options->filter(function (PackagingOption $option) use ($decisionSession) {
            return empty($option->applicable_markets)
                || in_array($decisionSession->market_slug, $option->applicable_markets, true);
        });

        $selected = $marketFiltered->count() >= 3 ? $marketFiltered : $options;

        return response()->json([
            'options' => $selected->take(3)->values()->map(fn (PackagingOption $option) => [
                'id' => $option->id,
                'label' => $option->label,
                'description' => $option->description,
                // Only the priority-relevant scores are shown as qualitative dots on stage 6;
                // raw weighted totals stay server-side until the result screen.
                'scores' => $option->scores,
            ]),
        ]);
    }

    public function decide(Request $request, DecisionSession $decisionSession): JsonResponse
    {
        $data = $request->validate([
            'packaging_option_id' => ['required', 'exists:packaging_options,id'],
        ]);

        $priorities = array_filter([
            $decisionSession->priority_1_slug,
            $decisionSession->priority_2_slug,
            $decisionSession->priority_3_slug,
        ]);

        abort_if(count($priorities) !== 3, 422, 'Top 3 priorities must be set before deciding.');

        $option = PackagingOption::findOrFail($data['packaging_option_id']);

        $result = $this->scoringService->score($option, array_values($priorities));

        $decisionSession->update([
            'packaging_option_id' => $option->id,
            'weighted_score' => $result['weighted_score'],
            'fit_score' => $result['fit_score'],
            'profile' => $result['profile'],
            'strength' => $result['strength'],
            'trade_off' => $result['trade_off'],
            'completed_at' => now(),
        ]);

        return response()->json([
            'session' => $decisionSession->fresh(),
            'result' => [
                ...$result,
                'solution_label' => $option->label,
            ],
        ]);
    }

    public function handoff(Request $request, DecisionSession $decisionSession): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:email,expert'],
        ]);

        $visitor = $decisionSession->visitor;

        if ($visitor instanceof Visitor) {
            $visitor->update(
                $data['type'] === 'email'
                    ? ['email_sent_at' => now()]
                    : ['handoff_requested_at' => now()]
            );
        }

        return response()->json(['status' => 'ok']);
    }
}
