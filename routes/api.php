<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\RABItemController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\SOPController;
use App\Http\Controllers\Api\VendorCategoryController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard/stats', [EventController::class, 'dashboard']);

    // Events
    Route::apiResource('events', EventController::class);

    // Vendor Categories
    Route::apiResource('vendor-categories', VendorCategoryController::class);

    // Vendors
    Route::apiResource('vendors', VendorController::class);

    // RAB Items
    Route::apiResource('rab-items', RABItemController::class);
    Route::get('events/{event}/rab-total', [RABItemController::class, 'calculateTotal']);

    // Proposals
    Route::apiResource('proposals', ProposalController::class);
    Route::post('proposals/{proposal}/send', [ProposalController::class, 'send']);
    Route::post('proposals/{proposal}/sign', [ProposalController::class, 'sign']);

    // Transactions
    Route::apiResource('transactions', TransactionController::class);
    Route::post('transactions/{transaction}/approve', [TransactionController::class, 'approve']);
    Route::post('transactions/{transaction}/reject', [TransactionController::class, 'reject']);
    Route::get('events/{event}/budget-status', [TransactionController::class, 'budgetStatus']);

    // SOPs
    Route::apiResource('sops', SOPController::class);
    Route::get('sops/categories/list', [SOPController::class, 'categories']);
});
