<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SOP;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SOPController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SOP::with('creator');
        
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $sops = $query->paginate(15);
        return response()->json($sops);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'file_path' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();
        
        $sop = SOP::create($validated);
        return response()->json($sop->load('creator'), 201);
    }

    public function show(SOP $sOP): JsonResponse
    {
        return response()->json($sOP->load('creator'));
    }

    public function update(Request $request, SOP $sOP): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|string',
            'description' => 'nullable|string',
            'content' => 'sometimes|string',
            'file_path' => 'nullable|string',
        ]);

        $sOP->update($validated);
        return response()->json($sOP->load('creator'));
    }

    public function destroy(SOP $sOP): JsonResponse
    {
        $sOP->delete();
        return response()->json(null, 204);
    }

    public function categories(): JsonResponse
    {
        $categories = SOP::distinct()->pluck('category');
        return response()->json($categories);
    }
}
