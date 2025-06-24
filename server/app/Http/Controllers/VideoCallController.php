<?php

namespace App\Http\Controllers;

use App\Events\RequestVideoCall;
use App\Events\RequestVideoCallStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class VideoCallController extends Controller
{
    public function requestVideoCall(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $authUser = JWTAuth::user();
            if (!$authUser) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
            }

            $peerId = $request->input('peerId');
            if (!$peerId) {
                return response()->json(['success' => false, 'message' => 'Peer ID is required'], 400);
            }

            broadcast(new RequestVideoCall($user, $authUser, $peerId));

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'peerId' => $peerId,
                        'fromUser' => [
                            'id' => $authUser->id,
                            'name' => $authUser->name,
                        ],
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Video call request error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function requestVideoCallStatus(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $authUser = JWTAuth::user();
            if (!$authUser) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
            }

            $peerId = $request->input('peerId');
            $status = $request->input('status');
            if (!$peerId || !$status) {
                return response()->json(['success' => false, 'message' => 'Peer ID and status are required'], 400);
            }

            Log::info("Broadcasting RequestVideoCallStatus", [
                'to_user_id' => $user->id,
                'from_user_id' => $authUser->id,
                'peer_id' => $peerId,
                'status' => $status,
            ]);
            broadcast(new RequestVideoCallStatus($user, $authUser, $peerId, $status));

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'peerId' => $peerId,
                        'status' => $status,
                        'fromUser' => [
                            'id' => $authUser->id,
                            'name' => $authUser->name,
                        ],
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Video call status error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Status update failed'], 500);
        }
    }

    public function getContacts(Request $request)
    {
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $users = User::where('id', '!=', $user->id)->get(['id', 'name']);
        return response()->json(['success' => true, 'data' => $users]);
    }
}
