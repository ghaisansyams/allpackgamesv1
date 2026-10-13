<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
                // The wedge position the wheel must land on — now that bomb/prize are shown
                // directly on the wheel face, the visual landing must match the real outcome,
                // so the frontend needs to know exactly which physical wedge this is.
                'sort_order' => $segment->sort_order,
                'outcome' => $segment->outcome,
                'reward_label' => $segment->reward_label,
                'message' => $segment->message,
            ],
        ], 201);
    }

    /**
     * The visitor is already known from the QR/phone join flow by the time anyone spins, so
     * this just records that they asked to talk to the team — no second data form needed.
     */
    public function handoff(Request $request, WheelSpin $wheelSpin): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => ['nullable', 'exists:visitors,id'],
        ]);

        $wheelSpin->update([
            'visitor_id' => $data['visitor_id'] ?? $wheelSpin->visitor_id,
            'handoff_requested_at' => now(),
        ]);

        return response()->json(['status' => 'ok']);
    }
}
