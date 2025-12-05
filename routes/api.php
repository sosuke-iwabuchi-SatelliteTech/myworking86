<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPrizeController;
use Illuminate\Support\Facades\Route;

Route::post('/user', [UserController::class, 'store']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/prizes', [UserPrizeController::class, 'store']);
    Route::get('/user/prizes', [UserPrizeController::class, 'index']);
});
