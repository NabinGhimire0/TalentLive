<?php
namespace App\Http\Controllers;

use App\Models\CourseTimeStamp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseTimeStampController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'skipped_from' => 'nullable|date',
            'skipped_to' => 'nullable|date|after_or_equal:skipped_from',
            'paused_at' => 'nullable|date',
            'resumed_at' => 'nullable|date|after_or_equal:paused_at',
            'completed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        // Ensure user is enrolled
        $enrollment = $request->user()->enrollments()->where('course_id', $request->course_id)->first();
        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'User not enrolled in this course',
                'data' => null
            ], 403);
        }

        $timestamp = CourseTimeStamp::create($request->only([
            'course_id', 'skipped_from', 'skipped_to', 'paused_at', 'resumed_at', 'completed_at'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Timestamp created successfully',
            'data' => $timestamp->load('course')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $timestamp = CourseTimeStamp::find($id);
        if (!$timestamp) {
            return response()->json([
                'success' => false,
                'message' => 'Timestamp not found',
                'data' => null
            ], 404);
        }

        // Ensure user is enrolled
        $enrollment = $request->user()->enrollments()->where('course_id', $timestamp->course_id)->first();
        if (!$enrollment && !$request->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'skipped_from' => 'nullable|date',
            'skipped_to' => 'nullable|date|after_or_equal:skipped_from',
            'paused_at' => 'nullable|date',
            'resumed_at' => 'nullable|date|after_or_equal:paused_at',
            'completed_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $timestamp->update($request->only([
            'skipped_from', 'skipped_to', 'paused_at', 'resumed_at', 'completed_at'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Timestamp updated successfully',
            'data' => $timestamp->load('course')
        ]);
    }
}