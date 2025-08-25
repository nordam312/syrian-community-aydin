<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'student_id' => ['required', 'regex:/^b\d{4}\.\d{6}$/', 'unique:users'],
            'phone' => 'nullable|string|max:20',
            'major' => 'nullable|string|max:100',
            'academic_year' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'student_id' => $request->student_id,
            'phone' => $request->phone ?? null,
            'major' => $request->major ?? null,
            'academic_year' => $request->academic_year ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'تم التسجيل بنجاح'
        ], 201);
    }


    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string', // يمكن أن يكون email أو student_id
            'password' => 'required',
        ]);

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_id';

        // محاولة تسجيل الدخول
        if (!Auth::attempt([$loginField => $request->login, 'password' => $request->password])) {
            throw ValidationException::withMessages([
                'login' => ['المعلومات المدخلة غير صحيحة.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'تم الدخول بنجاح'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تم تسجيل الخروج']);
    }

    public function user(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}
