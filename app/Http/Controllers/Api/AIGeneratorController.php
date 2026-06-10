<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventTimeplan;
use App\Models\RABItem;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AIGeneratorController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Generate budget items and timeplan suggestions from Gemini.
     */
    public function generatePlan(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'prompt' => 'nullable|string|max:1000',
        ]);

        try {
            $plan = $this->geminiService->generateEventPlan($event, $request->input('prompt'));
            return response()->json($plan);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghasilkan plan menggunakan AI: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save the suggested items into the database (append or overwrite).
     */
    public function applyPlan(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'mode' => 'required|in:append,overwrite',
            'budget_items' => 'required|array',
            'budget_items.*.name' => 'required|string',
            'budget_items.*.unit' => 'required|string',
            'budget_items.*.quantity' => 'required|integer|min:1',
            'budget_items.*.unit_price' => 'required|numeric|min:0',
            'budget_items.*.notes' => 'nullable|string',
            
            'timeplan_items' => 'required|array',
            'timeplan_items.*.day_offset' => 'required|string',
            'timeplan_items.*.time_start' => 'nullable|string',
            'timeplan_items.*.time_end' => 'nullable|string',
            'timeplan_items.*.activity' => 'required|string',
            'timeplan_items.*.pic' => 'required|string',
            'timeplan_items.*.notes' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($event, $validated) {
                if ($validated['mode'] === 'overwrite') {
                    // Delete existing items
                    RABItem::where('event_id', $event->id)->delete();
                    EventTimeplan::where('event_id', $event->id)->delete();
                }

                // Insert budget items
                foreach ($validated['budget_items'] as $item) {
                    RABItem::create([
                        'event_id' => $event->id,
                        'name' => $item['name'],
                        'unit' => $item['unit'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $item['quantity'] * $item['unit_price'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                }

                // Insert timeplans
                foreach ($validated['timeplan_items'] as $item) {
                    EventTimeplan::create([
                        'event_id' => $event->id,
                        'day_offset' => $item['day_offset'],
                        'time_start' => $item['time_start'] ?? null,
                        'time_end' => $item['time_end'] ?? null,
                        'activity' => $item['activity'],
                        'pic' => $item['pic'],
                        'notes' => $item['notes'] ?? null,
                    ]);
                }
            });

            return response()->json([
                'message' => 'Rekomendasi AI berhasil diterapkan ke event!'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error applying AI plan: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan rencana ke database.'
            ], 500);
        }
    }

    /**
     * Get all timeplans for an event.
     */
    public function getTimeplans(Event $event): JsonResponse
    {
        $timeplans = EventTimeplan::where('event_id', $event->id)
            ->get()
            ->sortBy(function ($item) {
                // Sorting logic:
                // 1. If it contains "H-", extract the number and sort in descending order of day offset (e.g. H-30 comes first, then H-7, H-1)
                // 2. Anything else (e.g. Hari Pelaksanaan) comes last
                if (preg_match('/H-(\d+)/i', $item->day_offset, $matches)) {
                    return -1 * intval($matches[1]);
                }
                return 0; // "Hari Pelaksanaan" or other offsets
            })
            ->values();

        return response()->json($timeplans);
    }

    /**
     * Store a single timeplan item.
     */
    public function storeTimeplan(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'day_offset' => 'required|string',
            'time_start' => 'nullable|string',
            'time_end' => 'nullable|string',
            'activity' => 'required|string',
            'pic' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $validated['event_id'] = $event->id;
        $timeplan = EventTimeplan::create($validated);

        return response()->json($timeplan, 201);
    }

    /**
     * Update a single timeplan item.
     */
    public function updateTimeplan(Request $request, EventTimeplan $timeplan): JsonResponse
    {
        $validated = $request->validate([
            'day_offset' => 'sometimes|string',
            'time_start' => 'nullable|string',
            'time_end' => 'nullable|string',
            'activity' => 'sometimes|string',
            'pic' => 'sometimes|string',
            'notes' => 'nullable|string',
        ]);

        $timeplan->update($validated);

        return response()->json($timeplan);
    }

    /**
     * Delete a single timeplan item.
     */
    public function destroyTimeplan(EventTimeplan $timeplan): JsonResponse
    {
        $timeplan->delete();
        return response()->json(null, 204);
    }
}
