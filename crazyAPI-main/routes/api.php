<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ShellController;
use Illuminate\Support\Facades\Route;


Route::post('login', [AuthController::class , "login"])->name("api.login");
Route::middleware("auth:sanctum")->post("/logout",[AuthController::class , "logout"]);

Route::prefix("/shell")->group(function(): void{
    Route::post("/command",[ShellController::class,"command"]);
    Route::get("/monitor",[ShellController::class,"monitor"]);
}
)->middleware([
     "auth:sanctum"
]);
