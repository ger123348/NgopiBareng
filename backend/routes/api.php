<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CampusController;
use App\Http\Middleware\EnsureAdmin;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes
Route::get('/cafes', [CafeController::class, 'index']);
Route::get('/cafes/{id}', [CafeController::class, 'show']);
Route::get('/campuses', [CampusController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Cafe routes
    Route::post('/cafes', [CafeController::class, 'store']); // Submission
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Admin routes
    Route::middleware([EnsureAdmin::class])->group(function () {
        Route::patch('/cafes/{id}/status', [CafeController::class, 'updateStatus']); // Approve/Reject/Hide
        Route::delete('/cafes/{id}', [CafeController::class, 'destroy']);
        Route::delete('/reviews/admin/{id}', [ReviewController::class, 'adminDestroy']);
        Route::get('/admin/stats', [DashboardController::class, 'stats']);
        Route::post('/campuses', [CampusController::class, 'store']);
    });
});
