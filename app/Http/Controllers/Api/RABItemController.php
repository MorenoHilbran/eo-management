<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RABItem;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RABItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = RABItem::with('event');
        
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        $items = $query->paginate(20);
        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['total_price'] = $validated['quantity'] * $validated['unit_price'];
        $item = RABItem::create($validated);

        return response()->json($item->load('event'), 201);
    }

    public function show(RABItem $rABItem): JsonResponse
    {
        return response()->json($rABItem->load('event'));
    }

    public function update(Request $request, RABItem $rABItem): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'unit' => 'sometimes|string',
            'quantity' => 'sometimes|integer|min:1',
            'unit_price' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['quantity']) || isset($validated['unit_price'])) {
            $quantity = $validated['quantity'] ?? $rABItem->quantity;
            $unitPrice = $validated['unit_price'] ?? $rABItem->unit_price;
            $validated['total_price'] = $quantity * $unitPrice;
        }

        $rABItem->update($validated);
        return response()->json($rABItem->load('event'));
    }

    public function destroy(RABItem $rABItem): JsonResponse
    {
        $rABItem->delete();
        return response()->json(null, 204);
    }

    public function calculateTotal(Event $event): JsonResponse
    {
        $total = RABItem::where('event_id', $event->id)->sum('total_price');
        $margin = ($total * 0.15); // 15% default margin
        
        return response()->json([
            'event_id' => $event->id,
            'total_cost' => $total,
            'margin' => $margin,
            'total_with_margin' => $total + $margin,
        ]);
    }
}
