<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Routes affected by CORS
    'allowed_methods' => ['*'], // Allow all HTTP methods
    'allowed_origins' => ['*'], // Allow all origins
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Allow all headers
    'exposed_headers' => [],
    'max_age' => 0, // Preflight request cache duration (seconds)
    'supports_credentials' => true, // IMPORTANT: Set to true when using credentials
];