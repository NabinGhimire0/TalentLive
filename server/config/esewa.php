<?php
return [
    'merchant_id' => env('ESEWA_MERCHANT_ID', 'EPAYTEST'),
    'test_mode' => env('ESEWA_TEST_MODE', true),
    'base_url' => env('ESEWA_TEST_MODE', true) ? 'https://uat.esewa.com.np' : 'https://esewa.com.np',
    'success_url' => env('ESEWA_SUCCESS_URL', 'http://192.168.13.127:8000/api/payment/success'),
    'failure_url' => env('ESEWA_FAILURE_URL', 'http://192.168.13.127:8000/api/payment/failure'),
];
