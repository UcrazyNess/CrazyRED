<?php

use Illuminate\Support\Facades\Route;
use Modules\Thalamus\Http\Controllers\ThalamusController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('thalamuses', ThalamusController::class)->names('thalamus');
});
