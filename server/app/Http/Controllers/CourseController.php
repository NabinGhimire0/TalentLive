<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['instructor', 'enrollments'])->get();
        return response()->json([
            'success' => true,
            'message' => 'Courses retrieved successfully',
            'data' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'skills' => 'required|array',
            'skills.*' => 'exists:skills,id',
            'price' => 'required|numeric|min:0',
            'video' => 'required|file|mimetypes:video/mp4,video/x-msvideo,video/quicktime,video/x-matroska',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $videoPath = null;
        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoName = time() . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('uploads/courses/videos'), $videoName);
            $videoPath = 'uploads/courses/videos/' . $videoName;
        }

        $course = new Course();
        $course->instructor_id = $request->user()->id;
        $course->title = $request->title;
        $course->description = $request->description;
        $course->skills = json_encode($request->skills);
        $course->price = $request->price;
        $course->video = $videoPath;
        $course->save();

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course->load(['instructor', 'enrollments'])
        ], 201);
    }

    public function show($id)
    {
        $course = Course::with(['instructor', 'enrollments'])->find($id);
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Course retrieved successfully',
            'data' => $course
        ]);
    }

    public function update(Request $request, $id)
    {
        $course = Course::find($id);
        $user = JWTAuth::user();

        if (!$course || ($user->role !== 'admin' && $course->instructor_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found or unauthorized',
                'data' => null
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'price' => 'numeric|min:0',
            'video' => 'file|mimetypes:video/mp4,video/x-msvideo,video/quicktime,video/x-matroska',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        // Update fields if provided
        if ($request->has('title')) {
            $course->title = $request->title;
        }

        if ($request->has('description')) {
            $course->description = $request->description;
        }

        if ($request->has('skills')) {
            $course->skills = json_encode($request->skills);
        }

        if ($request->has('price')) {
            $course->price = $request->price;
        }

        // Handle video upload
        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoName = time() . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('uploads/courses/videos'), $videoName);
            $course->video = 'uploads/courses/videos/' . $videoName;
        }

        $course->save();

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course->load(['instructor', 'enrollments'])
        ]);
    }


    public function destroy(Request $request, $id)
    {
        $course = Course::find($id);
        if (!$course || (!$request->user()->hasRole('admin') && $course->instructor_id !== $request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found or unauthorized',
                'data' => null
            ], 404);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully',
            'data' => null
        ]);
    }
}
