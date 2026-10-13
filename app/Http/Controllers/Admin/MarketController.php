<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMarketRequest;
use App\Models\Market;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MarketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Markets/Index', [
            'markets' => Market::orderBy('sort_order')->get(),
        ]);
    }

    public function store(StoreMarketRequest $request): RedirectResponse
    {
        Market::create($request->validated());

        return back()->with('success', 'Market created.');
    }

    public function update(StoreMarketRequest $request, Market $market): RedirectResponse
    {
        $market->update($request->validated());

        return back()->with('success', 'Market updated.');
    }

    public function destroy(Market $market): RedirectResponse
    {
        $market->delete();

        return back()->with('success', 'Market deleted.');
    }
}
