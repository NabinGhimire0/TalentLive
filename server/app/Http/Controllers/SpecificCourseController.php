<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class SpecificCourseController extends Controller
{
    public function homeCourses()
    {
        $courses = Course::with('instructor')
            ->withCount('enrollments') // adds enrollments_count
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Home courses fetched successfully',
            'data' => $courses,
        ]);
    }

    public function userCourses(Request $request)
    {
        $user = JWTAuth::user();

        $courses = Course::with(['instructor', 'enrollments' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])->get();

        // Map and enrich data
        $coursesWithData = $courses->map(function ($course) use ($user) {
            $enrollment = $course->enrollments->first();
            return [
                'course' => $course,
                'enrolled' => (bool) $enrollment,
                'timestamp' => $enrollment && $enrollment->timeStamp ? $enrollment->timeStamp : null,
            ];
        });

        // Sort enrolled courses to top
        $sorted = $coursesWithData->sortByDesc('enrolled')->values();

        return response()->json([
            'success' => true,
            'message' => 'User courses fetched successfully',
            'data' => $sorted,
        ]);
    }

    public function userSingleCourse($id)
    {
        $user = JWTAuth::user();

        $course = Course::with(['instructor', 'enrollments' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])->find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null,
            ], 404);
        }

        $enrollment = $course->enrollments->first();

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'User is not enrolled in this course',
                'data' => null,
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Enrolled course fetched successfully',
            'data' => [
                'course' => $course,
                'timestamp' => $enrollment->timeStamp ?? null,
            ]
        ]);
    }

    public function publicCourse($id)
    {
        $course = Course::with('instructor')
            ->withCount('enrollments')
            ->find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Public course fetched successfully',
            'data' => $course,
        ]);
    }
}
