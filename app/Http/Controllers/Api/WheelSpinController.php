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

        return response()->json([
            'spin' => [
                'id' => $spin->id,
                'outcome' => $segment->outcome,
                'reward_label' => $segment->reward_label,
                'message' => $segment->message,
            ],
        ], 201);
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
