<?php

namespace App\Http\Controllers;

use App\Events\VisitorJoinedBoothSession;
use App\Models\BoothSession;
use App\Models\Visitor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JoinController extends Controller
{
    /**
     * Mobile-facing biodata form the visitor fills on their own phone after scanning the QR
     * code on the booth touch screen, instead of typing it on the big screen.
     */
    public function show(string $token): Response
    {
        $boothSession = BoothSession::where('token', $token)->firstOrFail();

        return Inertia::render('Join', [
            'token' => $token,
            'alreadyClaimed' => $boothSession->status === 'claimed',
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $boothSession = BoothSession::where('token', $token)->firstOrFail();

        abort_if($boothSession->status === 'claimed', 422, 'This session has already been used.');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'industry' => ['required', 'string', 'max:255'],
            'industry_other' => ['nullable', 'string', 'max:255'],
        ]);

        $visitor = Visitor::create($data);

        $boothSession->update([
            'visitor_id' => $visitor->id,
            'status' => 'claimed',
            'claimed_at' => now(),
        ]);

        VisitorJoinedBoothSession::dispatch($boothSession);

        return redirect()->route('join.thanks', $token);
    }

    public function thanks(string $token): Response
    {
        BoothSession::where('token', $token)->firstOrFail();

        return Inertia::render('JoinThanks');
    }
}
