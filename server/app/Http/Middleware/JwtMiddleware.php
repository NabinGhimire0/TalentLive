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
            // First check the token validity
            if (!$token = JWTAuth::parseToken()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not provided',
                    'data' => null
                ], 401);
            }

            // Try to authenticate using the token
            JWTAuth::authenticate();

            return $next($request);
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

        // return $next($request);
    }
}
