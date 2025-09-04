<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use Illuminate\Support\Str;


class AuthController extends Controller
{
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

        // إنشاء توكن التحقق
        $verificationToken = Str::random(60);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'student_id' => $request->student_id,
            'phone' => $request->phone ?? null,
            'major' => $request->major ?? null,
            'academic_year' => $request->academic_year ?? null,
            'verification_token' => $verificationToken,
            'email_verified_at' => null, // لم يتم التحقق بعد
        ]);

        // إرسال بريد التحقق
        Mail::to($user->email)->send(new EmailVerification($user, $verificationToken));

        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.'
        ], 201);
    }
    public function verifyEmail(Request $request, $token)
    {
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            // عرض صفحة الخطأ
            return view('verification-result', [
                'success' => false,
                'title' => 'فشل التفعيل',
                'message' => 'رابط التحقق غير صالح أو منتهي الصلاحية',
                'icon' => '❌',
                'buttonText' => 'طلب رابط جديد',
                'buttonLink' => '/request-new-verification'
            ]);
        }

        // تحديث حالة المستخدم
        $user->email_verified_at = now();
        $user->verification_token = null;
        $user->save();

        // عرض صفحة النجاح
        return view('verification-result', [
            'success' => true,
            'title' => 'تم التفعيل بنجاح!',
            'message' => 'تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول والاستفادة من جميع الخدمات.',
            'icon' => '✅',
            'buttonText' => 'تسجيل الدخول',
            'buttonLink' => '/login',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required',
        ]);

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_id';
        $user = User::where($loginField, $request->login)->first();

        // التحقق من أن البريد الإلكتروني مفعل
        if ($user && !$user->email_verified_at) {
            throw ValidationException::withMessages([
                'login' => ['حسابك غير مفعل. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.'],
            ]);
        }

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

    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'الحساب مفعل بالفعل.'], 400);
        }

        // إنشاء توكن جديد وإرسال البريد مرة أخرى
        $verificationToken = Str::random(60);
        $user->update(['verification_token' => $verificationToken]);

        Mail::to($user->email)->send(new EmailVerification($user, $verificationToken));

        return response()->json(['message' => 'تم إعادة إرسال بريد التحقق.']);
    }

    // باقي الدوال (logout, user) تبقى كما هي
}