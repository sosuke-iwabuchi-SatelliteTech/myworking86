<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController as ApiUserController;
use App\Http\Controllers\Api\PointController;
use App\Http\Controllers\Api\UserPrizeController;
use App\Http\Controllers\Api\GachaController;
use App\Http\Controllers\Api\PrizeController as ApiPrizeController;
use App\Http\Controllers\Api\TradeController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\PrizeController as WebPrizeController;
use App\Http\Controllers\Web\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Web\Admin\UserController as AdminUserController;
use App\Http\Controllers\Web\TradeController as WebTradeController;

Route::post('/api/user/login', [ApiUserController::class, 'login']);
Route::post('/api/user', [ApiUserController::class, 'store']);

Route::middleware('auth')->prefix('api')->group(function () {
    Route::post('points/award', [PointController::class, 'award']);
    Route::get('points', [PointController::class, 'show']);

    Route::post('user/prizes', [UserPrizeController::class, 'store']);
    Route::get('user/prizes', [UserPrizeController::class, 'index']);
    Route::get('user/prizes/tradable', [UserPrizeController::class, 'tradable']);
    Route::get('users/{user}/prizes/tradable', [UserPrizeController::class, 'userTradable']);

    // Gacha Routes
    Route::get('gacha/status', [GachaController::class, 'status']);
    Route::post('gacha/pull', [GachaController::class, 'pull']);

    // Master Data Routes
    // Master Data Routes
    Route::get('prizes', [ApiPrizeController::class, 'index']);

    // Trade Routes
    Route::post('trades', [TradeController::class, 'store']);
    Route::get('trades', [TradeController::class, 'index']);
    Route::get('trades/{id}', [TradeController::class, 'show']);
    Route::put('trades/{id}/accept', [TradeController::class, 'accept']);
    Route::put('trades/{id}/reject', [TradeController::class, 'reject']);
    Route::put('trades/{id}/cancel', [TradeController::class, 'cancel']);
});

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('prizes', [WebPrizeController::class, 'index'])->name('prizes.index');

    // Web Trade Routes
    Route::get('trades', [WebTradeController::class, 'index'])->name('trades.index');
    Route::get('trades/create', [WebTradeController::class, 'create'])->name('trades.create');
    Route::get('trades/{id}', [WebTradeController::class, 'show'])->name('trades.show');
});


Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::put('users/{user}/points', [AdminUserController::class, 'updatePoints'])->name('users.updatePoints');
});

require __DIR__ . '/settings.php';
