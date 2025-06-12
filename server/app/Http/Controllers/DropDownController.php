<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class DropDownController extends Controller
{
    public function getCompany()
    {
        $company = User::where('role', 'industry')->get();
        return response()->json([
            'success' => true,
            'message' => 'company fetched successfully',
            'data' => $company
        ]);
    }
}
