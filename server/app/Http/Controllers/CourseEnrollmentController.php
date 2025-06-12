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
                'course_id' => $course->id,
                'price' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Free course enrolled successfully',
                'data' => $enrollment->load(['user', 'course'])
            ], 201);
        }

        $transaction_uuid = Str::uuid()->toString();
        $total_amount = $course->price;
        $token = bin2hex(random_bytes(16));

        // Generate signature (Base64-encoded HMAC-SHA256)
        $plainText = "total_amount={$total_amount},transaction_uuid={$transaction_uuid},product_code=EPAYTEST";
        $signature = base64_encode(hash_hmac('sha256', $plainText, config('esewa.secret_key'), true));

        Log::info('eSewa signature generated', ['plainText' => $plainText, 'signature' => $signature]);

        // Form data
        $data = [
            'amount' => $total_amount,
            'tax_amount' => 0,
            'total_amount' => $total_amount,
            'transaction_uuid' => $transaction_uuid,
            'product_code' => 'EPAYTEST',
            'product_service_charge' => 0,
            'product_delivery_charge' => 0,
            'success_url' => config('esewa.success_url') . '?token=' . $token,
            'failure_url' => config('esewa.failure_url') . '?token=' . $token,
            'signature' => $signature,
            'signed_field_names' => 'total_amount,transaction_uuid,product_code',
        ];

        // Log success_url for debugging
        Log::info('eSewa form data prepared', [
            'form_data' => $data,
            'success_url' => $data['success_url'],
        ]);

        // Cache for later verification
        cache()->put("enrollment_{$token}", [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'price' => $course->price,
            'transaction_uuid' => $transaction_uuid,
        ], now()->addHours(2)); // Increased to 2 hours

        return response()->json([
            'success' => true,
            'message' => 'Redirect to eSewa for payment',
            'data' => [
                'payment_url' => config('esewa.base_url') . '/api/epay/main/v2/form',
                'form_data' => $data,
            ]
        ]);
    }

    public function paymentSuccess(Request $request)
    {
        // Extract raw token and check if it's appended with `?data=...`
        $rawToken = $request->query('token', '');
        $queryData = $request->query('data', '');

        // Separate token and base64-encoded data from the malformed token
        if (str_contains($rawToken, '?data=')) {
            [$cleanToken, $encodedData] = explode('?data=', $rawToken, 2);
            $token = $cleanToken;
            $queryData = $queryData ?: $encodedData; // Override query data if needed
        } else {
            $token = $rawToken;
        }

        // Decode eSewa base64 data (if any)
        $amt = $request->query('amt');
        $refId = $request->query('refId');
        $pid = $request->query('oid') ?? $request->query('pid');
        $decodedData = null;

        if ($queryData) {
            try {
                $decodedData = json_decode(base64_decode($queryData), true);
                if (is_array($decodedData)) {
                    $amt = $amt ?: ($decodedData['total_amount'] ?? null);
                    $refId = $refId ?: ($decodedData['transaction_code'] ?? null);
                    $pid = $pid ?: ($decodedData['transaction_uuid'] ?? null);

                    if (($decodedData['status'] ?? '') !== 'COMPLETE') {
                        Log::error('Payment not completed', ['data' => $decodedData]);
                        return response()->json(['success' => false, 'message' => 'Payment not completed'], 400);
                    }
                }
            } catch (\Exception $e) {
                Log::error('Failed to decode eSewa data parameter', [
                    'error' => $e->getMessage(),
                    'data' => $queryData
                ]);
            }
        }

        // Log parsed info
        Log::info('eSewa payment success callback', [
            'token' => $token,
            'amt' => $amt,
            'refId' => $refId,
            'pid' => $pid,
            'decoded_data' => $decodedData,
        ]);

        // Basic validation
        if (!$token || !$amt || !$refId || !$pid) {
            Log::error('Missing payment success parameters', [
                'token' => $token,
                'amt' => $amt,
                'refId' => $refId,
                'pid' => $pid,
                'query' => $request->query(),
            ]);
            return response()->json(['success' => false, 'message' => 'Missing required parameters'], 400);
        }

        // Get enrollment data from cache
        $enrollmentData = cache()->pull("enrollment_{$token}");
        if (!$enrollmentData || $enrollmentData['transaction_uuid'] !== $pid) {
            Log::error('Enrollment not found or mismatched UUID', [
                'token' => $token,
                'pid' => $pid,
                'cached_data' => $enrollmentData,
            ]);
            return response()->json(['success' => false, 'message' => 'Transaction expired or invalid'], 400);
        }

        try {
            // Verify payment with eSewa
            $response = $this->httpClient->post(config('esewa.base_url') . '/epay/transrec', [
                'form_params' => [
                    'amt' => $amt,
                    'scd' => config('esewa.merchant_id'),
                    'pid' => $pid,
                ],
            ]);

            $body = $response->getBody()->getContents();
            Log::info('eSewa verification response', ['body' => $body]);

            $xml = simplexml_load_string($body);
            if (!$xml || (string)$xml->response_code !== 'Success') {
                Log::error('Payment verification failed', ['response' => $body]);
                return response()->json(['success' => false, 'message' => 'Payment verification failed'], 400);
            }

            // Create enrollment record
            $enrollment = CourseEnrollment::create([
                'user_id' => $enrollmentData['user_id'],
                'course_id' => $enrollmentData['course_id'],
                'payment_id' => $refId,
                'payment_method' => 'esewa',
                'price' => $enrollmentData['price'],
            ]);

            Log::info('Payment verified and enrollment created', [
                'uuid' => $enrollmentData['transaction_uuid'],
                'refId' => $refId,
                'enrollment_id' => $enrollment->id,
            ]);

            // Redirect to frontend
            $frontendUrl = config('app.frontend_url', 'http://localhost:5173') . '/user/tutorials?payment=success';
            return redirect($frontendUrl);
        } catch (\Exception $e) {
            Log::error('Payment verification error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'eSewa verification error'], 500);
        }
    }

    public function paymentFailure(Request $request)
    {
        $token = $request->query('token');
        $pid = $request->query('oid') ?? $request->query('pid');
        cache()->forget("enrollment_{$token}");

        Log::warning('Payment failed or cancelled', ['token' => $token, 'pid' => $pid]);

        $frontendUrl = config('app.frontend_url', 'http://localhost:5173') . '/user/tutorials?payment=failed';
        return redirect($frontendUrl);
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
