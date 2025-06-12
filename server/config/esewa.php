<?php
return [
    'merchant_id' => env('ESEWA_MERCHANT_ID', 'EPAYTEST'),
    'base_url' => env('ESEWA_BASE_URL', 'https://rc-epay.esewa.com.np'),
    'success_url' => env('ESEWA_SUCCESS_URL', 'https://bbb7-202-51-86-227.ngrok-free.app/api/payment/success'),
    'failure_url' => env('ESEWA_FAILURE_URL', 'https://bbb7-202-51-86-227.ngrok-free.app/api/payment/failure'),
];
