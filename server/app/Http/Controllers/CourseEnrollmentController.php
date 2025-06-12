<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseEnrollment;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class CourseEnrollmentController extends Controller
{
    protected $httpClient;

    public function __construct()
    {
        $this->httpClient = new Client();
    }

    public function index(Request $request)
    {
        $user = JWTAuth::user();
        $role = $user->role;

        $enrollments = $role === 'admin'
            ? CourseEnrollment::with(['user', 'course'])->get()
            : $user->enrollments()->with(['user', 'course'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Enrollments retrieved successfully',
            'data' => $enrollments
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'payment_id' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
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
            // Free course, enroll directly
            $enrollment = $user->enrollments()->create([
                'course_id' => $request->course_id,
                'payment_id' => null,
                'payment_method' => null,
                'price' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Enrollment created successfully for free course',
                'data' => $enrollment->load(['user', 'course'])
            ], 201);
        }

        // Paid course, initiate eSewa payment
        $transaction_uuid = uniqid('txn_');
        $total_amount = $course->price;
        $tax_amount = 0; // Adjust if tax applies
        $service_amount = 0; // Adjust if service fee applies
        $delivery_amount = 0; // Adjust if delivery fee applies
        $amount = $total_amount - ($tax_amount + $service_amount + $delivery_amount);
        $signature = "total_amount=$total_amount,transaction_uuid=$transaction_uuid,product_code=EPAYTEST";

        $data = [
            'amount' => $amount,
            'product_delevery_charge' => $delivery_amount,
            'product_service_charge' => $service_amount,
            'tax_amount' => $tax_amount,
            'total_amount' => $total_amount,
            'transaction_uuid' => $transaction_uuid,
            'signature' => $signature,
            'signed_field_names' => 'total_amount,transaction_uuid,product_code',

            'scd' => config('esewa.merchant_id'),
            'success_url' => config('esewa.success_url') . '?course_id=' . $course->id . '&user_id=' . $user->id,
            'failure_url' => config('esewa.failure_url'),
        ];

        // Store pending enrollment data in session or cache (simplified here)
        cache()->put("enrollment_{$transaction_uuid}", [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'price' => $course->price,
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
        $oid = $request->query('oid'); // Transaction UUID
        $amt = $request->query('amt'); // Amount
        $refId = $request->query('refId'); // eSewa reference ID
        $course_id = $request->query('course_id');
        $user_id = $request->query('user_id');

        // Retrieve pending enrollment data
        $enrollmentData = cache()->pull("enrollment_{$oid}");
        if (!$enrollmentData) {
            Log::error('Enrollment data not found', ['oid' => $oid]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired transaction',
                'data' => null
            ], 400);
        }

        // Verify payment with eSewa
        try {
            $response = $this->httpClient->post(config('esewa.base_url') . '/epay/transrec', [
                'form_params' => [
                    'scd' => config('esewa.merchant_id'),
                    'pid' => $oid,
                    'amt' => $amt,
                ],
            ]);

            $body = $response->getBody()->getContents();
            if (strpos($body, 'Success') === false) {
                Log::error('eSewa payment verification failed', ['oid' => $oid, 'response' => $body]);
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed',
                    'data' => null
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('eSewa verification error', ['oid' => $oid, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Payment verification error',
                'data' => null
            ], 500);
        }

        // Create enrollment
        $enrollment = CourseEnrollment::create([
            'user_id' => $user_id,
            'course_id' => $course_id,
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
        $oid = $request->query('oid');
        cache()->forget("enrollment_{$oid}");

        Log::warning('Payment failed or cancelled', ['oid' => $oid]);

        return response()->json([
            'success' => false,
            'message' => 'Payment failed or cancelled',
            'data' => null
        ], 400);
    }

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
