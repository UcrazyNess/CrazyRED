<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Str;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function login(Request $request)
    {

        $validate = Validator::make($request->all(), [
            "userName" => ["regex:/^\w+$/", "required"],
            "password" => ["required"]
        ]);

        if($validate->fails()){
            return response()->json(["bad request" => $validate->errors()], 422);
        }

        $validated = $validate->validated();
        $user = User::where("name", $validated["userName"])->first();

        if(!$user){
            return response()->json([
                "message" => "auth failed",
                "data" => ["error"=> "user doesn't exist"]
            ], 404);
        }

        if(Hash::check($validated["password"], $user->password)){
            $time = now()->timezone('Asia/Tehran')->toDateTimeString();
            $token = $user->createToken("user.{$user->name}")->plainTextToken;
            $username = Str::slug($user->name);

            Storage::makeDirectory("logs/$username");
            $path = storage_path("logs/$username/{$token}_{$time}.log");

            $logger = Log::build([
                'driver' => 'single',
                'path' => $path
            ]);

            $logger->alert("User logged in {$time}", [
                "user" => $user->name,
                "token" => $token,
                "ip" => $request->ip(),
            ]);

            $cookie = cookie("AuthToken", $token, 180, httpOnly:true);
            session(["logingPath" => $path]);

            return response()->json([
                "message" => "Auth success",
                "data" => [
                    "sessionEX" => now()->timezone('Asia/Tehran')->addMinutes(180)->toDateTimeString(),
                    "status" => "logging"
                ]
                ],200)->withCookie($cookie);
        }

        return response()->json([
            "message" => "auth failed",
            "data" => ["error"=> "password incorrect"]
        ],422);


    }

    /**
     * Show the form for creating a new resource.
     */
    public function logout(Request $request)
    {
        $token = $request->cookie("access_token");
        $user = Auth::user();
        if($user && $token){
            $user->currentAccessToken()->delete();
            $cookie = cookie()->forget("AuthToken");
            return response(200)->withCookie($cookie);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
