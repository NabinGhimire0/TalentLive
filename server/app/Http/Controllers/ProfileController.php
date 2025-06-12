<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class ProfileController extends Controller
{
    /**
     * Fetch CV-like profile data for all users (admin only).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {

            // Fetch all users with their related data
            $users = User::with([
                'skills.category',
                'projects' => function ($query) {
                    $query->with('user')->select('id', 'user_id', 'title', 'description', 'skills', 'demo', 'project_link', 'duration', 'status', 'created_at', 'updated_at');
                },
                'workHistories' => function ($query) {
                    $query->with('company')->select('id', 'user_id', 'company_id', 'position', 'responsibilities', 'type', 'start_date', 'end_date', 'verified', 'created_at', 'updated_at');
                },
                'educations' => function ($query) {
                    $query->select('id', 'user_id', 'degree', 'institution', 'field_of_study', 'skills', 'start_date', 'end_date', 'created_at', 'updated_at');
                },
                'enrollments' => function ($query) {
                    $query->with(['course.instructor', 'timeStamp'])
                        ->select('id', 'user_id', 'course_id', 'payment_id', 'payment_method', 'price', 'created_at', 'updated_at');
                },
                'mmr'
            ])->where('role', 'individual')->get();

            // Structure the CV-like data for each user
            $profilesData = $users->map(function ($user) {
                return $this->formatProfileData($user);
            });

            return response()->json([
                'success' => true,
                'message' => 'All users\' profile data retrieved successfully',
                'data' => $profilesData
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication error: ' . $e->getMessage(),
                'data' => null
            ], 401);
        }
    }

    /**
     * Fetch CV-like profile data for the authenticated user or a specified user (admin only).
     *
     * @param Request $request
     * @param int|null $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id = null)
    {
        try {
            $currentUser = JWTAuth::user();

            // Check if authenticated user exists
            if (!$currentUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated: No user found for the provided token',
                    'data' => null
                ], 401);
            }

            // If no ID is provided, fetch the authenticated user's profile
            if (!$id) {
                $user = $currentUser;
            } else {
                // If an ID is provided, only admins can fetch another user's profile
                if ($currentUser->role !== 'admin') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized: Only admins can view other users\' profiles',
                        'data' => null
                    ], 403);
                }
                $user = User::find($id);
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'User not found',
                        'data' => null
                    ], 404);
                }
            }

            // Load related data
            $user->load([
                'skills.category',
                'projects' => function ($query) {
                    $query->with('user')->select('id', 'user_id', 'title', 'description', 'skills', 'demo', 'project_link', 'duration', 'status', 'created_at', 'updated_at');
                },
                'workHistories' => function ($query) {
                    $query->with('company')->select('id', 'user_id', 'company_id', 'position', 'responsibilities', 'type', 'start_date', 'end_date', 'verified', 'created_at', 'updated_at');
                },
                'educations' => function ($query) {
                    $query->select('id', 'user_id', 'degree', 'institution', 'field_of_study', 'skills', 'start_date', 'end_date', 'created_at', 'updated_at');
                },
                'enrollments' => function ($query) {
                    $query->with(['course.instructor', 'timeStamp'])
                        ->select('id', 'user_id', 'course_id', 'payment_id', 'payment_method', 'price', 'created_at', 'updated_at');
                },
                'mmr'
            ]);

            // Structure the CV-like data
            $profileData = $this->formatProfileData($user);

            return response()->json([
                'success' => true,
                'message' => 'Profile data retrieved successfully',
                'data' => $profileData
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication error: ' . $e->getMessage(),
                'data' => null
            ], 401);
        }
    }

    /**
     * Format a user's CV-like profile data.
     *
     * @param User $user
     * @return array
     */
    protected function formatProfileData(User $user)
    {
        return [
            'personal_info' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'location' => $user->location,
                'role' => $user->role,
                'bio' => $user->bio,
                'profile_picture' => $user->profile_picture,
                'github_id' => $user->github_id,
                'email_verified_at' => $user->email_verified_at ? $user->email_verified_at->toDateTimeString() : null,
            ],
            'skills' => $user->skills->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'category' => [
                        'id' => $skill->category->id,
                        'name' => $skill->category->name,
                    ],
                ];
            }),
            'projects' => $user->projects->map(function ($project) {
                $skills = is_array($project->skills) ? $project->skills : json_decode($project->skills, true) ?? [];
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'description' => $project->description,
                    'skills' => Skill::whereIn('id', $skills)->get()->map(function ($skill) {
                        return [
                            'id' => $skill->id,
                            'name' => $skill->name,
                            'category_id' => $skill->category_id,
                        ];
                    }),
                    'demo' => is_array($project->demo) ? $project->demo : json_decode($project->demo, true) ?? [],
                    'project_link' => $project->project_link,
                    'duration' => $project->duration,
                    'status' => $project->status,
                    'created_at' => $project->created_at->toDateTimeString(),
                    'updated_at' => $project->updated_at->toDateTimeString(),
                ];
            }),
            'work_history' => $user->workHistories->map(function ($history) {
                return [
                    'id' => $history->id,
                    'company' => [
                        'id' => $history->company->id,
                        'name' => $history->company->name,
                    ],
                    'position' => $history->position,
                    'responsibilities' => $history->responsibilities,
                    'type' => $history->type,
                    'start_date' => $history->start_date,
                    'end_date' => $history->end_date,
                    'verified' => $history->verified,
                    'created_at' => $history->created_at->toDateTimeString(),
                    'updated_at' => $history->updated_at->toDateTimeString(),
                ];
            }),
            'education' => $user->educations->map(function ($education) {
                $skills = is_array($education->skills) ? $education->skills : json_decode($education->skills, true) ?? [];
                return [
                    'id' => $education->id,
                    'degree' => $education->degree,
                    'institution' => $education->institution,
                    'field_of_study' => $education->field_of_study,
                    'skills' => Skill::whereIn('id', $skills)->get()->map(function ($skill) {
                        return [
                            'id' => $skill->id,
                            'name' => $skill->name,
                            'category_id' => $skill->category_id,
                        ];
                    }),
                    'start_date' => $education->start_date ? $education->start_date->toDateString() : null,
                    'end_date' => $education->end_date ? $education->end_date->toDateString() : null,
                    'created_at' => $education->created_at->toDateTimeString(),
                    'updated_at' => $education->updated_at->toDateTimeString(),
                ];
            }),
            'courses' => $user->enrollments->map(function ($enrollment) {
                $skills = is_array($enrollment->course->skills) ? $enrollment->course->skills : json_decode($enrollment->course->skills, true) ?? [];
                return [
                    'id' => $enrollment->id,
                    'course' => [
                        'id' => $enrollment->course->id,
                        'title' => $enrollment->course->title,
                        'description' => $enrollment->course->description,
                        'skills' => Skill::whereIn('id', $skills)->get()->map(function ($skill) {
                            return [
                                'id' => $skill->id,
                                'name' => $skill->name,
                                'category_id' => $skill->category_id,
                            ];
                        }),
                        'instructor' => [
                            'id' => $enrollment->course->instructor->id,
                            'name' => $enrollment->course->instructor->name,
                        ],
                    ],
                    'payment_id' => $enrollment->payment_id,
                    'payment_method' => $enrollment->payment_method,
                    'price' => $enrollment->price,
                    'timestamp' => $enrollment->timeStamp ? [
                        'skipped_from' => $enrollment->timeStamp->skipped_from,
                        'skipped_to' => $enrollment->timeStamp->skipped_to,
                        'paused_at' => $enrollment->timeStamp->paused_at,
                        'resumed_at' => $enrollment->timeStamp->resumed_at,
                        'completed_at' => $enrollment->timeStamp->completed_at,
                    ] : null,
                    'created_at' => $enrollment->created_at->toDateTimeString(),
                    'updated_at' => $enrollment->updated_at->toDateTimeString(),
                ];
            }),
            'mmr' => $user->mmr ? [
                'total_mmr' => $user->mmr->mmr,
                'categories' => Category::whereIn('id', array_keys(is_array($user->mmr->categories) ? $user->mmr->categories : json_decode($user->mmr->categories, true) ?? []))
                    ->get()
                    ->map(function ($category) use ($user) {
                        $categories = is_array($user->mmr->categories) ? $user->mmr->categories : json_decode($user->mmr->categories, true) ?? [];
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'mmr' => $categories[$category->id] ?? 0,
                        ];
                    })->values(),
                'skills' => Skill::whereIn('id', array_keys(is_array($user->mmr->skills) ? $user->mmr->skills : json_decode($user->mmr->skills, true) ?? []))
                    ->get()
                    ->map(function ($skill) use ($user) {
                        $skills = is_array($user->mmr->skills) ? $user->mmr->skills : json_decode($user->mmr->skills, true) ?? [];
                        return [
                            'id' => $skill->id,
                            'name' => $skill->name,
                            'mmr' => $skills[$skill->id] ?? 0,
                        ];
                    })->values(),
                'github' => $user->mmr->github,
                'created_at' => $user->mmr->created_at->toDateTimeString(),
                'updated_at' => $user->mmr->updated_at->toDateTimeString(),
            ] : null,
        ];
    }
}
