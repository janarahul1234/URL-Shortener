<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LinkController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => 'Server health is good.');
Route::get('/{shortUrl}', [LinkController::class, 'redirect']);
