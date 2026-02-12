<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class tokeAcss
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $token =   $request->cookie('AuthToken');
        if($token && !$request->header('Authorization')){
            $bareare = 'Bearer ' . $token;
            $request->headers->set("Authorization",$bareare);
            $request->server->set('HTTP_AUTHORIZATION', $bareare);
            $_SERVER["HTTP_AUTHORIZATION"] = $bareare;
        }
        return $next($request);
    }
}
