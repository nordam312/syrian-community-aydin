<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     * Apply admin middleware to all methods
     */
    public function __construct()
    {
        // This is already handled in routes/api.php with middleware group
        // But adding here for extra security
    }

    public function dashboard()
    {
        return response()->json([
            'message' => 'مرحباً بك في لوحة تحكم الأدمن!',
            'status' => 'success'
        ]);
    }
}
