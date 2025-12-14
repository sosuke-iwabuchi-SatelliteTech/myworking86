<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController as ApiUserController;
use App\Http\Controllers\Api\PointController;
use App\Http\Controllers\Api\UserPrizeController;
use App\Http\Controllers\Api\GachaController;
use App\Http\Controllers\Api\PrizeController as ApiPrizeController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\PrizeController as WebPrizeController;
use App\Http\Controllers\Web\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Web\Admin\UserController as AdminUserController;

Route::post('/api/user/login', [ApiUserController::class, 'login']);
Route::post('/api/user', [ApiUserController::class, 'store']);

Route::middleware('auth')->prefix('api')->group(function () {
    Route::post('points/award', [PointController::class, 'award']);
    Route::get('points', [PointController::class, 'show']);

    Route::post('user/prizes', [UserPrizeController::class, 'store']);
    Route::get('user/prizes', [UserPrizeController::class, 'index']);

    // Gacha Routes
    Route::get('gacha/status', [GachaController::class, 'status']);
    Route::post('gacha/pull', [GachaController::class, 'pull']);

    // Master Data Routes
    Route::get('prizes', [ApiPrizeController::class, 'index']);
});

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('prizes', [WebPrizeController::class, 'index'])->name('prizes.index');
});


Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::put('users/{user}/points', [AdminUserController::class, 'updatePoints'])->name('users.updatePoints');
});

require __DIR__ . '/settings.php';
