<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');

    Route::get('google', 'redirectToAuth');
    Route::get('google/callback', 'handleAuthCallback');
    
    Route::get('logout', 'logout')->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('users/current', [UserController::class, 'current']);
    Route::apiResource('users', UserController::class)->except(['store']);

    Route::get('overview', [LinkController::class, 'overview']);
    Route::apiResource('links', LinkController::class);
});
