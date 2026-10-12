<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'industry' => ['required', 'string', 'max:255'],
            'industry_other' => ['nullable', 'string', 'max:255'],
        ]);

        $visitor = Visitor::create($data);

        return response()->json(['visitor' => $visitor], 201);
    }
}
