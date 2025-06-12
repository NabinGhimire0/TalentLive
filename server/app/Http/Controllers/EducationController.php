<?php
namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class EducationController extends Controller
{
    public function index(Request $request)
    {
        $user = JWTAuth::user();
        $educations = $user->role === 'admin'
            ? Education::with('user')->get()
            : $user->educations()->with('user')->get();

        return response()->json([
            'success' => true,
            'message' => 'Educations retrieved successfully',
            'data' => $educations
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'degree' => 'nullable|string|max:255',
            'institution' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $education = $request->user()->educations()->create($request->only([
            'degree', 'institution', 'field_of_study', 'skills',
            'start_date', 'end_date'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Education created successfully',
            'data' => $education->load('user')
        ], 201);
    }

    public function show($id)
    {
        $education = Education::with('user')->find($id);
        $user = JWTAuth::user();

        if (!$education || ($user->role !== 'admin' && $education->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Education not found or unauthorized',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Education retrieved successfully',
            'data' => $education
        ]);
    }

    public function update(Request $request, $id)
    {
        $education = Education::find($id);
        $user = JWTAuth::user();

        if (!$education || ($user->role !== 'admin' && $education->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Education not found or unauthorized',
                'data' => null
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'degree' => 'nullable|string|max:255',
            'institution' => 'nullable|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $education->update($request->only([
            'degree', 'institution', 'field_of_study', 'skills',
            'start_date', 'end_date'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Education updated successfully',
            'data' => $education->load('user')
        ]);
    }

    public function destroy($id)
    {
        $education = Education::find($id);
        $user = JWTAuth::user();

        if (!$education || ($user->role !== 'admin' && $education->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Education not found or unauthorized',
                'data' => null
            ], 404);
        }

        $education->delete();

        return response()->json([
            'success' => true,
            'message' => 'Education deleted successfully',
            'data' => null
        ]);
    }
}