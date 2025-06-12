<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class SearchController extends Controller
{
    public function searchIndividuals(Request $request)
    {
        $user = JWTAuth::user();
        // if ($user->role !== 'industry') {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Unauthorized: Only industry users can search',
        //         'data' => null
        //     ], 403);
        // }

        $validator = Validator::make($request->all(), [
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $query = User::where('role', 'individual')
            ->with(['mmr', 'skills.category']);

        // Filter by categories
        if ($request->has('categories')) {
            $query->whereHas('skills', function ($q) use ($request) {
                $q->whereIn('category_id', $request->categories);
            });
        }

        // Filter by skills
        if ($request->has('skills')) {
            $query->whereHas('skills', function ($q) use ($request) {
                $q->whereIn('skills.id', $request->skills);
            });
        }

        // Sort by MMR
        $individuals = $query->get()->sortByDesc(function ($user) {
            return $user->mmr ? $user->mmr->mmr : 0;
        })->values();

        return response()->json([
            'success' => true,
            'message' => 'Individuals retrieved successfully',
            'data' => $individuals
        ]);
    }
}
