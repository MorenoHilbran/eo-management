<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VendorController extends Controller
{
    public function index(): JsonResponse
    {
        $vendors = Vendor::with('category', 'events')
            ->paginate(15);
        return response()->json($vendors);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:vendor_categories,id',
            'contact_person' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $vendor = Vendor::create($validated);
        return response()->json($vendor->load('category'), 201);
    }

    public function show(Vendor $vendor): JsonResponse
    {
        return response()->json($vendor->load('category', 'events'));
    }

    public function update(Request $request, Vendor $vendor): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'category_id' => 'sometimes|exists:vendor_categories,id',
            'contact_person' => 'sometimes|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $vendor->update($validated);
        return response()->json($vendor->load('category'));
    }

    public function destroy(Vendor $vendor): JsonResponse
    {
        $vendor->delete();
        return response()->json(null, 204);
    }
}
