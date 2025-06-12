<?php

namespace App\Http\Controllers;

use App\Jobs\UpdateGithubMMRJob;
use App\Models\User;
use App\Services\MMRService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MMRController extends Controller
{
    protected $mmrService;

    public function __construct(MMRService $mmrService)
    {
        $this->mmrService = $mmrService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $mmr = $this->mmrService->recalculateMMR($user);

        return response()->json([
            'success' => true,
            'message' => 'MMR retrieved successfully',
            'data' => $mmr
        ]);
    }
    /**
     * Recalculate MMR for a specific user (admin only).
     */
    public function recalculate(Request $request)
    {
        if (!$request->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $user = User::find($request->user_id);
        $mmr = $this->mmrService->recalculateMMR($user);

        return response()->json([
            'success' => true,
            'message' => 'MMR recalculated successfully',
            'data' => $mmr
        ]);
    }

    /**
     * Queue a GitHub MMR update for the authenticated user.
     */
    public function updateGithub(Request $request)
    {
        $user = $request->user();
        dispatch(new UpdateGithubMMRJob($user));

        return response()->json([
            'success' => true,
            'message' => 'GitHub MMR update queued',
            'data' => null
        ]);
    }
}
