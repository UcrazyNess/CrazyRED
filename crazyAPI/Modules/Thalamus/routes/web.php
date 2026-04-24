<?php

use Illuminate\Support\Facades\Route;
use Modules\Thalamus\Http\Controllers\ThalamusController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('thalamuses', ThalamusController::class)->names('thalamus');
});
