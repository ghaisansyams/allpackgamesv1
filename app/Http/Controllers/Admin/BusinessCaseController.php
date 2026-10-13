<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBusinessCaseRequest;
use App\Models\BusinessCase;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BusinessCaseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/BusinessCases/Index', [
            'businessCases' => BusinessCase::withCount('packagingOptions')->orderBy('sort_order')->get(),
        ]);
    }

    public function store(StoreBusinessCaseRequest $request): RedirectResponse
    {
        BusinessCase::create($request->validated());

        return back()->with('success', 'Business case created.');
    }

    public function update(StoreBusinessCaseRequest $request, BusinessCase $businessCase): RedirectResponse
    {
        $businessCase->update($request->validated());

        return back()->with('success', 'Business case updated.');
    }

    public function destroy(BusinessCase $businessCase): RedirectResponse
    {
        $businessCase->delete();

        return back()->with('success', 'Business case deleted.');
    }
}
