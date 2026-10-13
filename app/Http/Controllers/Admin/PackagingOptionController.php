<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackagingOptionRequest;
use App\Models\BusinessCase;
use App\Models\Market;
use App\Models\PackagingOption;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PackagingOptionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PackagingOptions/Index', [
            'businessCases' => BusinessCase::orderBy('sort_order')->get(['id', 'title']),
            'markets' => Market::orderBy('sort_order')->get(['id', 'slug', 'title']),
            'packagingOptions' => PackagingOption::with('businessCase:id,title')->orderBy('business_case_id')->orderBy('sort_order')->get(),
        ]);
    }

    public function store(StorePackagingOptionRequest $request): RedirectResponse
    {
        PackagingOption::create($request->validated());

        return back()->with('success', 'Packaging option created.');
    }

    public function update(StorePackagingOptionRequest $request, PackagingOption $packagingOption): RedirectResponse
    {
        $packagingOption->update($request->validated());

        return back()->with('success', 'Packaging option updated.');
    }

    public function destroy(PackagingOption $packagingOption): RedirectResponse
    {
        $packagingOption->delete();

        return back()->with('success', 'Packaging option deleted.');
    }
}
