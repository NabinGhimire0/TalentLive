<?php

namespace App\Http\Controllers;

use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class CourseEnrollmentController extends Controller
{

    public function index(Request $request)
    {
        $user = JWTAuth::user(); // get authenticated user
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

        $enrollment = $request->user()->enrollments()->create($request->only([
            'course_id',
            'payment_id',
            'payment_method',
            'price'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Enrollment created successfully',
            'data' => $enrollment->load(['user', 'course'])
        ], 201);
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
