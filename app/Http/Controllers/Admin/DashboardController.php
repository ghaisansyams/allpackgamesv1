<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DecisionSession;
use App\Models\Visitor;
use App\Models\WheelSpin;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'visitors' => Visitor::count(),
                'decision_sessions_completed' => DecisionSession::whereNotNull('completed_at')->count(),
                'decision_sessions_started' => DecisionSession::count(),
                'wheel_spins' => WheelSpin::count(),
                'wheel_wins' => WheelSpin::whereHas('wheelSegment', fn ($q) => $q->where('outcome', 'win'))->count(),
                'handoffs_requested' => Visitor::whereNotNull('handoff_requested_at')->count()
                    + WheelSpin::whereNotNull('handoff_requested_at')->count(),
            ],
        ]);
    }
}
