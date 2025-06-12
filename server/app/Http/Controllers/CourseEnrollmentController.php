<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseEnrollment;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class CourseEnrollmentController extends Controller
{
    protected $httpClient;

    public function __construct()
    {
        $this->httpClient = new Client();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $course = Course::find($request->course_id);
        $user = $request->user();

        if ($course->price <= 0) {
            $enrollment = $user->enrollments()->create([
                'course_id' => $request->course_id,
                'price' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Enrollment created successfully for free course',
                'data' => $enrollment->load(['user', 'course'])
            ], 201);
        }

        $transaction_uuid = Str::uuid()->toString();
        $total_amount = $course->price;
        $tax_amount = 0;
        $service_amount = 0;
        $delivery_amount = 0;
        $amount = $total_amount - ($tax_amount + $service_amount + $delivery_amount);
        $token = bin2hex(random_bytes(16));

        $data = [
            'amount' => $amount,
            'tax_amount' => $tax_amount,
            'total_amount' => $total_amount,
            'transaction_uuid' => $transaction_uuid,
            'product_code' => 'EPAYTEST',
            'product_service_charge' => $service_amount,
            'product_delivery_charge' => $delivery_amount,
            'success_url' => config('esewa.success_url') . '?token=' . $token,
            'failure_url' => config('esewa.failure_url'),
            'merchant_code' => config('esewa.merchant_id'),
        ];

        $signature = hash_hmac('sha256', "total_amount={$total_amount},transaction_uuid={$transaction_uuid},product_code=EPAYTEST", config('esewa.secret_key'));
        $data['signature'] = $signature;

        cache()->put("enrollment_{$token}", [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'price' => $course->price,
            'transaction_uuid' => $transaction_uuid,
        ], now()->addMinutes(30));

        return response()->json([
            'success' => true,
            'message' => 'Redirect to eSewa for payment',
            'data' => [
                'payment_url' => config('esewa.base_url') . '/epay/main',
                'form_data' => $data,
            ]
        ], 200);
    }

    public function paymentSuccess(Request $request)
    {
        $token = $request->query('token');
        $amt = $request->query('amt');
        $refId = $request->query('refId');

        $enrollmentData = cache()->pull("enrollment_{$token}");
        if (!$enrollmentData) {
            Log::error('Enrollment data not found', ['token' => $token]);
            return response()->json(['success' => false, 'message' => 'Invalid or expired transaction'], 400);
        }

        try {
            $response = $this->httpClient->post(config('esewa.base_url') . '/epay/transrec', [
                'form_params' => [
                    'scd' => config('esewa.merchant_id'),
                    'pid' => $enrollmentData['transaction_uuid'],
                    'amt' => $amt,
                ],
            ]);

            $body = $response->getBody()->getContents();
            $xml = simplexml_load_string($body);
            if ($xml === false || (string)$xml->response_code !== 'Success') {
                Log::error('eSewa payment verification failed', ['transaction_uuid' => $enrollmentData['transaction_uuid'], 'response' => $body]);
                return response()->json(['success' => false, 'message' => 'Payment verification failed'], 400);
            }

            Log::info('Payment verified successfully', ['transaction_uuid' => $enrollmentData['transaction_uuid'], 'refId' => $refId]);
        } catch (\Exception $e) {
            Log::error('eSewa verification error', ['transaction_uuid' => $enrollmentData['transaction_uuid'], 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Payment verification error'], 500);
        }

        $enrollment = CourseEnrollment::create([
            'user_id' => $enrollmentData['user_id'],
            'course_id' => $enrollmentData['course_id'],
            'payment_id' => $refId,
            'payment_method' => 'esewa',
            'price' => $enrollmentData['price'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Enrollment created successfully after payment',
            'data' => $enrollment->load(['user', 'course'])
        ], 201);
    }

    public function paymentFailure(Request $request)
    {
        $token = $request->query('token');
        cache()->forget("enrollment_{$token}");
        Log::warning('Payment failed or cancelled', ['token' => $token]);
        return response()->json(['success' => false, 'message' => 'Payment failed or cancelled'], 400);
    }

    // Other methods (index, show, destroy) remain unchanged...

    public function show(Request $request, $id)
    {
        $enrollment = CourseEnrollment::with(['user', 'course'])->find($id);
        $user = JWTAuth::user();

        if (!$enrollment || ($user->role !== 'admin' && $enrollment->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Enrollment not found or unauthorized',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Enrollment retrieved successfully',
            'data' => $enrollment
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $enrollment = CourseEnrollment::find($id);
        $user = JWTAuth::user();

        if (!$enrollment || ($user->role !== 'admin' && $enrollment->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Enrollment not found or unauthorized',
                'data' => null
            ], 404);
        }

        $enrollment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Enrollment deleted successfully',
            'data' => null
        ]);
    }
}
