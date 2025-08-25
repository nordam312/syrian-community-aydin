<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    //
    public function dashboard()
    {
        return response()->json([
            'message' => 'مرحباً بك في لوحة تحكم الأدمن!',
            'status' => 'success'
        ]);
    }
}
