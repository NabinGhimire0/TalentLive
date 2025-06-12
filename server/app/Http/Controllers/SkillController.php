<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::with('category')->get();
        return response()->json([
            'success' => true,
            'message' => 'Skills retrieved successfully',
            'data' => $skills
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:skills',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $skill = Skill::create($request->only('name', 'category_id'));

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully',
            'data' => $skill->load('category')
        ], 201);
    }

    public function show($id)
    {
        $skill = Skill::with('category')->find($id);
        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Skill retrieved successfully',
            'data' => $skill
        ]);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::find($id);
        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found',
                'data' => null
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:skills,name,' . $id,
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ], 422);
        }

        $skill->update($request->only('name', 'category_id'));

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully',
            'data' => $skill->load('category')
        ]);
    }

    public function destroy($id)
    {
        $skill = Skill::find($id);
        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found',
                'data' => null
            ], 404);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully',
            'data' => null
        ]);
    }
}
