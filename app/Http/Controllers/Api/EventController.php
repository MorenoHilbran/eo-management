<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
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
        ]);

        $validated['created_by'] = auth()->id();
        $event = Event::create($validated);

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

        return response()->json([
            'total_events' => $totalEvents,
            'ongoing_events' => $ongoingEvents,
            'completed_events' => $completedEvents,
            'total_budget' => $totalBudget,
        ]);
    }
}
