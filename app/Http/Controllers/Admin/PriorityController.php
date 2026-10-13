<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePriorityRequest;
use App\Models\Priority;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PriorityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Priorities/Index', [
            'priorities' => Priority::orderBy('sort_order')->get(),
        ]);
    }

    public function store(StorePriorityRequest $request): RedirectResponse
    {
        Priority::create($request->validated());

        return back()->with('success', 'Priority created.');
    }

    public function update(StorePriorityRequest $request, Priority $priority): RedirectResponse
    {
        $priority->update($request->validated());

        return back()->with('success', 'Priority updated.');
    }

    public function destroy(Priority $priority): RedirectResponse
    {
        $priority->delete();

        return back()->with('success', 'Priority deleted.');
    }
}
