<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie','broadcasting/auth'], // Routes affected by CORS
    'access_control_allow_origin' => ['*'],
    'Access-Control-Allow-Methods' =>['GET, POST, OPTIONS'],
    'Access-Control-Allow-Headers'=> ['Origin, Content-Type, Accept, Authorization'],
    'allowed_methods' => ['*'], // Allow all HTTP methods
    'allowed_origins' => ['*'], // Allow all origins
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Allow all headers
    'exposed_headers' => [],
    'max_age' => 0, // Preflight request cache duration (seconds)
    'supports_credentials' => true, // IMPORTANT: Set to true when using credentials
];