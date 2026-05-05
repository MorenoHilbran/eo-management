<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VendorCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VendorCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = VendorCategory::with('vendors')->paginate(15);
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:vendor_categories',
            'description' => 'nullable|string',
        ]);

        $category = VendorCategory::create($validated);
        return response()->json($category, 201);
    }

    public function show(VendorCategory $vendorCategory): JsonResponse
    {
        return response()->json($vendorCategory->load('vendors'));
    }

    public function update(Request $request, VendorCategory $vendorCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|unique:vendor_categories,name,' . $vendorCategory->id,
            'description' => 'nullable|string',
        ]);

        $vendorCategory->update($validated);
        return response()->json($vendorCategory->load('vendors'));
    }

    public function destroy(VendorCategory $vendorCategory): JsonResponse
    {
        if ($vendorCategory->vendors()->exists()) {
            return response()->json(['error' => 'Cannot delete category with vendors'], 403);
        }

        $vendorCategory->delete();
        return response()->json(null, 204);
    }
}
