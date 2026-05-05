<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProposalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Proposal::with('event', 'creator');
        
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        $proposals = $query->paginate(15);
        return response()->json($proposals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'template_name' => 'required|string',
            'content' => 'nullable|string',
            'expires_at' => 'nullable|date',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'draft';
        
        $proposal = Proposal::create($validated);
        return response()->json($proposal->load('event', 'creator'), 201);
    }

    public function show(Proposal $proposal): JsonResponse
    {
        return response()->json($proposal->load('event', 'creator'));
    }

    public function update(Request $request, Proposal $proposal): JsonResponse
    {
        $validated = $request->validate([
            'template_name' => 'sometimes|string',
            'content' => 'nullable|string',
            'status' => 'sometimes|in:sent,signed,expired,draft,rejected',
            'expires_at' => 'nullable|date',
        ]);

        $proposal->update($validated);
        return response()->json($proposal->load('event', 'creator'));
    }

    public function destroy(Proposal $proposal): JsonResponse
    {
        $proposal->delete();
        return response()->json(null, 204);
    }

    public function send(Proposal $proposal): JsonResponse
    {
        $proposal->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return response()->json($proposal->load('event', 'creator'));
    }

    public function sign(Proposal $proposal, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'signature_file' => 'nullable|string',
        ]);

        $proposal->update(array_merge($validated, [
            'status' => 'signed',
            'signed_at' => now(),
        ]));

        return response()->json($proposal->load('event', 'creator'));
    }
}
