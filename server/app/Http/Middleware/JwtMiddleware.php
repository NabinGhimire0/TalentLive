<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            if (! $token = JWTAuth::parseToken()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not provided',
                    'data' => null
                ], 401);
            }

            $user = JWTAuth::authenticate();

            // Optionally attach the authenticated user to the request
            $request->setUserResolver(function () use ($user) {
                return $user;
            });

            return $next($request);  // <== You MUST call this to continue the request
        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired',
                'data' => null
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid',
                'data' => null
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token is not provided or is malformed',
                'data' => null
            ], 401);
        }
    }
}
