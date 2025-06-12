<?php

namespace App\Http\Controllers;

use App\Models\WorkHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class WorkHistoryController extends Controller
{

    public function index(Request $request)
    {
        $user = JWTAuth::user(); // or $request->user()
        $role = $user->role;

        $histories = $role === 'admin'
            ? WorkHistory::with(['user', 'company'])->get()
            : $user->workHistories()->with(['user', 'company'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Work histories retrieved successfully',
            'data' => $histories
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:users,id',
            'position' => 'required|string|max:255',
            'responsibilities' => 'required|string',
            'type' => 'required|in:job,internship',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $history = $request->user()->workHistories()->create($request->only([
            'company_id',
            'position',
            'responsibilities',
            'type',
            'start_date',
            'end_date'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Work history created successfully',
            'data' => $history->load(['user', 'company'])
        ], 201);
    }

    public function show($id)
    {
        $history = WorkHistory::with(['user', 'company'])->find($id);
        return response()->json([
            'success' => true,
            'message' => 'Work history retrieved successfully',
            'data' => $history
        ]);
    }

    public function update(Request $request, $id)
    {
        $history = WorkHistory::find($id);
        $validator = Validator::make($request->all(), [
            'company_id' => 'exists:users,id',
            'position' => 'string|max:255',
            'responsibilities' => 'string',
            'type' => 'in:job,internship',
            'start_date' => 'date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $history->update($request->only([
            'company_id',
            'position',
            'responsibilities',
            'type',
            'start_date',
            'end_date'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Work history updated successfully',
            'data' => $history->load(['user', 'company'])
        ]);
    }

    public function destroy($id)
    {
        $history = WorkHistory::find($id);
        $history->delete();

        return response()->json([
            'success' => true,
            'message' => 'Work history deleted successfully',
            'data' => null
        ]);
    }

    public function verify(Request $request, $id)
    {
        $history = WorkHistory::find($id);
        if (!$history) {
            return response()->json([
                'success' => false,
                'message' => 'Work history not found',
                'data' => null
            ], 404);
        }

        $history->update(['verified' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Work history verified successfully',
            'data' => $history->load(['user', 'company'])
        ]);
    }
}
