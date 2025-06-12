<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Contracts\Providers\JWT;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProjectController extends Controller
{

    public function index(Request $request)
    {
        $user = JWTAuth::user();
        $role = $user->role;
        $projects = $request->role === 'admin'
            ? Project::with('user')->get()
            : $request->user()->projects()->with('user')->get();

        return response()->json([
            'success' => true,
            'message' => 'Projects retrieved successfully',
            'data' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'skills' => 'required|array',
            'skills.*' => 'exists:skills,id',
            'demo' => 'nullable|array',
            'demo.*' => 'file|mimetypes:image/jpeg,image/png,image/gif,video/mp4,video/x-msvideo,video/quicktime,video/x-matroska',
            'project_link' => 'nullable|url',
            'duration' => 'nullable|string',
            'status' => 'in:ongoing,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $demoPaths = [];
        if ($request->hasFile('demo')) {
            foreach ($request->file('demo') as $file) {
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/projects/demo'), $filename);
                $demoPaths[] = 'uploads/projects/demo/' . $filename;
            }
        }

        $project = new Project();
        $project->user_id = $request->user()->id;
        $project->title = $request->title;
        $project->description = $request->description;
        $project->skills = json_encode($request->skills);
        $project->demo = json_encode($demoPaths); // store demo as JSON array
        $project->project_link = $request->project_link;
        $project->duration = $request->duration;
        $project->status = $request->status;
        $project->save();

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project->load('user')
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $project = Project::with('user')->find($id);
        $user = JWTAuth::user();
        $role = $user->role;
        if (!$project || (!$request->role === 'admin' && $project->user_id !== $request->user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found or unauthorized',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project retrieved successfully',
            'data' => $project
        ]);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        $user = JWTAuth::user();

        if (!$project || ($user->role !== 'admin' && $project->user_id !== $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found or unauthorized',
                'data' => null
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'demo' => 'nullable|array',
            'demo.*' => 'file|mimetypes:image/jpeg,image/png,image/gif,video/mp4,video/x-msvideo,video/quicktime,video/x-matroska',
            'project_link' => 'nullable|url',
            'duration' => 'nullable|string',
            'status' => 'in:ongoing,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        if ($request->has('title')) {
            $project->title = $request->title;
        }

        if ($request->has('description')) {
            $project->description = $request->description;
        }

        if ($request->has('skills')) {
            $project->skills = json_encode($request->skills);
        }

        if ($request->hasFile('demo')) {
            $demoPaths = json_decode($project->demo, true) ?? [];
            foreach ($request->file('demo') as $file) {
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/projects/demo'), $filename);
                $demoPaths[] = 'uploads/projects/demo/' . $filename;
            }
            $project->demo = json_encode($demoPaths);
        }

        if ($request->has('project_link')) {
            $project->project_link = $request->project_link;
        }

        if ($request->has('duration')) {
            $project->duration = $request->duration;
        }

        if ($request->has('status')) {
            $project->status = $request->status;
        }

        $project->save();

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project->load('user')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $project = Project::find($id);
        $user = JWTAuth::user();
        $role = $user->role;
        if (!$project || (!$request->$role === 'admin' && $project->user_id !== $request->$user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found or unauthorized',
                'data' => null
            ], 404);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
            'data' => null
        ]);
    }
}
