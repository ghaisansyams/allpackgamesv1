<?php

namespace App\Http\Controllers;

use App\Models\BoothSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class BoothSessionController extends Controller
{
    public function store(): JsonResponse
    {
        $boothSession = BoothSession::create(['token' => (string) Str::uuid()]);

        return response()->json(['token' => $boothSession->token], 201);
    }

    /**
     * Polling fallback for the touch screen in case the WebSocket connection drops — the
     * booth should never get stuck on the QR screen just because Reverb hiccuped.
     */
    public function show(string $token): JsonResponse
    {
        $boothSession = BoothSession::where('token', $token)->firstOrFail();

        return response()->json([
            'status' => $boothSession->status,
            'visitor_id' => $boothSession->visitor_id,
        ]);
    }
}
