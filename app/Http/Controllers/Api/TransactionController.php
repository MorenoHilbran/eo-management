<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Transaction::with('event', 'creator', 'approver');
        
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->paginate(15);
        return response()->json($transactions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'transaction_date' => 'required|date',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'pending';
        
        $transaction = Transaction::create($validated);
        return response()->json($transaction->load('event', 'creator'), 201);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json($transaction->load('event', 'creator', 'approver'));
    }

    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'sometimes|string',
            'transaction_date' => 'sometimes|date',
        ]);

        $transaction->update($validated);
        return response()->json($transaction->load('event', 'creator'));
    }

    public function destroy(Transaction $transaction): JsonResponse
    {
        if ($transaction->status !== 'pending') {
            return response()->json(['error' => 'Can only delete pending transactions'], 403);
        }

        $transaction->delete();
        return response()->json(null, 204);
    }

    public function approve(Transaction $transaction): JsonResponse
    {
        $transaction->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return response()->json($transaction->load('event', 'creator', 'approver'));
    }

    public function reject(Request $request, Transaction $transaction): JsonResponse
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $transaction->update(array_merge($validated, [
            'status' => 'rejected',
        ]));

        return response()->json($transaction->load('event', 'creator'));
    }

    public function budgetStatus(Event $event): JsonResponse
    {
        $approved = Transaction::where('event_id', $event->id)
            ->where('status', 'approved')
            ->sum('amount');
        
        $pending = Transaction::where('event_id', $event->id)
            ->where('status', 'pending')
            ->sum('amount');

        $remaining = $event->budget - $approved;

        return response()->json([
            'event_id' => $event->id,
            'budget' => $event->budget,
            'spent' => $approved,
            'pending' => $pending,
            'remaining' => $remaining,
            'budget_alert' => $remaining < ($event->budget * 0.2),
        ]);
    }
}
