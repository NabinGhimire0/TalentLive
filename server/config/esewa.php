<?php

return [
    'merchant_id' => env('ESEWA_MERCHANT_ID', 'EPAYTEST'),
    'base_url' => env('ESEWA_BASE_URL', 'https://rc-epay.esewa.com.np'),
    'success_url' => env('ESEWA_SUCCESS_URL', 'http://127.0.0.1:8000/api/payment/success'),
    'failure_url' => env('ESEWA_FAILURE_URL', 'http://127.0.0.1:8000/api/payment/failure'),
    'secret_key' => env('ESEWA_SECRET_KEY', '8gBm/:&EnhH.1/q'),
];