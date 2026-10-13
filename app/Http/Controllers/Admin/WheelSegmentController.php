<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWheelSegmentRequest;
use App\Models\WheelSegment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WheelSegmentController extends Controller
{
    /**
     * The wheel always has exactly 8 physical wedges (see ContentSeeder), so this screen only
     * lets the content/ops team edit each wedge's outcome, reward, and message — not add or
     * remove wedges, which would break the fixed 1-in-8 odds.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/WheelSegments/Index', [
            'wheelSegments' => WheelSegment::orderBy('sort_order')->get(),
        ]);
    }

    public function update(UpdateWheelSegmentRequest $request, WheelSegment $wheelSegment): RedirectResponse
    {
        $data = $request->validated();

        if ($data['outcome'] === 'win') {
            $otherWinExists = WheelSegment::where('outcome', 'win')
                ->whereKeyNot($wheelSegment->id)
                ->exists();

            if ($otherWinExists) {
                return back()->withErrors([
                    'outcome' => 'Another wedge is already the winning wedge. Change that one to "bomb" first.',
                ]);
            }
        }

        $wheelSegment->update($data);

        return back()->with('success', 'Wheel wedge updated.');
    }
}
