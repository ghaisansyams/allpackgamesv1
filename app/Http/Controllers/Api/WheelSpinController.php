<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use App\Models\WheelSpin;
use App\Services\WheelSpinService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WheelSpinController extends Controller
{
    public function __construct(private readonly WheelSpinService $wheelSpinService) {}

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => ['nullable', 'exists:visitors,id'],
        ]);

        $segment = $this->wheelSpinService->spin();

        $spin = WheelSpin::create([
            'visitor_id' => $data['visitor_id'] ?? null,
            'wheel_segment_id' => $segment->id,
        ]);

        $content = $segment->content ?? [];
        // The correct answer for a quiz segment is withheld until the visitor submits
        // their answer via `answer()`, otherwise the touch screen would leak it in the DOM.
        if ($segment->category === 'pack_quiz') {
            unset($content['correct_index']);
        }

        return response()->json([
            'spin' => [
                'id' => $spin->id,
                'category' => $segment->category,
                'label' => $segment->label,
                'reward_label' => $segment->reward_label,
                'content' => $content,
            ],
        ], 201);
    }

    public function answer(Request $request, WheelSpin $wheelSpin): JsonResponse
    {
        $data = $request->validate([
            'selected_index' => ['required', 'integer', 'min:0'],
        ]);

        $segment = $wheelSpin->wheelSegment;
        $correctIndex = $segment->content['correct_index'] ?? null;
        $isCorrect = $correctIndex !== null && (int) $data['selected_index'] === (int) $correctIndex;

        $wheelSpin->update(['is_correct' => $isCorrect]);

        return response()->json([
            'is_correct' => $isCorrect,
            'correct_index' => $correctIndex,
            'insight' => $segment->content['insight'] ?? null,
        ]);
    }

    public function handoff(Request $request, WheelSpin $wheelSpin): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => ['nullable', 'exists:visitors,id'],
            'name' => ['required_without:visitor_id', 'nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'contact' => ['required_without:visitor_id', 'nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
        ]);

        $visitorId = $data['visitor_id'] ?? null;

        if (! $visitorId && $wheelSpin->visitor_id === null) {
            $visitor = Visitor::create([
                'name' => $data['name'],
                'company' => $data['company'] ?? '-',
                'job_title' => $data['job_title'] ?? '-',
                'contact' => $data['contact'],
                'industry' => $data['industry'] ?? '-',
            ]);
            $visitorId = $visitor->id;
        }

        $wheelSpin->update([
            'visitor_id' => $visitorId ?? $wheelSpin->visitor_id,
            'handoff_requested_at' => now(),
        ]);

        return response()->json(['status' => 'ok', 'visitor_id' => $wheelSpin->fresh()->visitor_id]);
    }
}
