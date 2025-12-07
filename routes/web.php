<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PointController;

Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth')->prefix('api')->group(function () {
    Route::post('points/award', [PointController::class, 'award']);
    Route::get('points', [PointController::class, 'show']);

    Route::post('user/prizes', [\App\Http\Controllers\UserPrizeController::class, 'store']);
    Route::get('user/prizes', [\App\Http\Controllers\UserPrizeController::class, 'index']);

    // Gacha Routes
    Route::get('gacha/status', [\App\Http\Controllers\GachaController::class, 'status']);
    Route::post('gacha/pull', [\App\Http\Controllers\GachaController::class, 'pull']);
});

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('prizes', function () {
        return Inertia::render('PrizeList');
    })->name('prizes.index');
});


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
});

require __DIR__ . '/settings.php';
