<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\SOP;
use App\Models\Transaction;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = Event::with('creator', 'rabItems', 'vendors')
            ->paginate(15);
        return response()->json($events);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'location' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'status' => 'in:planning,ongoing,completed,cancelled',
            'generate_ai' => 'nullable|boolean',
        ]);

        $validated['created_by'] = auth()->id();

        $event = \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            $generateAI = $validated['generate_ai'] ?? false;
            unset($validated['generate_ai']);

            $event = Event::create($validated);

            if ($generateAI) {
                try {
                    $geminiService = app(\App\Services\GeminiService::class);
                    $plan = $geminiService->generateEventPlan($event);

                    if (isset($plan['budget_items']) && is_array($plan['budget_items'])) {
                        foreach ($plan['budget_items'] as $item) {
                            $event->rabItems()->create([
                                'name' => $item['name'],
                                'unit' => $item['unit'],
                                'quantity' => $item['quantity'],
                                'unit_price' => $item['unit_price'],
                                'total_price' => $item['quantity'] * $item['unit_price'],
                                'notes' => $item['notes'] ?? null,
                            ]);
                        }
                    }

                    if (isset($plan['timeplan_items']) && is_array($plan['timeplan_items'])) {
                        foreach ($plan['timeplan_items'] as $item) {
                            $event->timeplans()->create([
                                'day_offset' => $item['day_offset'],
                                'time_start' => $item['time_start'] ?? null,
                                'time_end' => $item['time_end'] ?? null,
                                'activity' => $item['activity'],
                                'pic' => $item['pic'],
                                'notes' => $item['notes'] ?? null,
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('AI Auto Generation failed on event creation: ' . $e->getMessage());
                }
            }

            return $event;
        });

        return response()->json($event->load('creator'), 201);
    }

    public function show(Event $event): JsonResponse
    {
        return response()->json($event->load('creator', 'rabItems', 'vendors', 'proposals', 'transactions'));
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'event_date' => 'sometimes|date',
            'location' => 'sometimes|string',
            'budget' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:planning,ongoing,completed,cancelled',
        ]);

        $event->update($validated);
        return response()->json($event->load('creator', 'rabItems', 'vendors'));
    }

    public function destroy(Event $event): JsonResponse
    {
        $event->delete();
        return response()->json(null, 204);
    }

    public function dashboard(): JsonResponse
    {
        $totalEvents = Event::count();
        $ongoingEvents = Event::where('status', 'ongoing')->count();
        $completedEvents = Event::where('status', 'completed')->count();
        $totalBudget = Event::sum('budget');
        $totalVendors = Vendor::count();
        $totalSops = SOP::count();
        $totalTransactions = Transaction::count();
        $totalSpent = Transaction::where('status', 'approved')->sum('amount');

        return response()->json([
            'total_events' => $totalEvents,
            'ongoing_events' => $ongoingEvents,
            'completed_events' => $completedEvents,
            'total_budget' => $totalBudget,
            'total_vendors' => $totalVendors,
            'total_sops' => $totalSops,
            'total_transactions' => $totalTransactions,
            'total_spent' => $totalSpent,
        ]);
    }
}
