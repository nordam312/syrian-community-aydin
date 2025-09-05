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
            // التحقق إذا كان المستخدم موجود لكن مفعل بالفعل
            $verifiedUser = User::whereNull('verification_token')->whereNotNull('email_verified_at')->first();
            
            // إذا كان الطلب JSON (من الفرونت إند)
            if ($request->expectsJson() || $request->header('Accept') === 'application/json') {
                $message = $verifiedUser ? 
                    'حسابك مفعل بالفعل. يمكنك تسجيل الدخول مباشرة.' : 
                    'رابط التحقق غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.';
                    
                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'already_verified' => !!$verifiedUser
                ], 400);
            }
            
            // عرض صفحة الخطأ للمتصفح العادي
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

        // إذا كان الطلب JSON (من الفرونت إند)
        if ($request->expectsJson() || $request->header('Accept') === 'application/json') {
            return response()->json([
                'success' => true,
                'message' => 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.',
                'user' => $user
            ]);
        }

        // عرض صفحة النجاح للمتصفح العادي
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
            'device_name' => 'nullable|string|max:100', // اسم الجهاز (اختياري)
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
        
        // تحديد اسم الجهاز
        $deviceName = $request->device_name ?: $request->header('User-Agent') ?: 'Unknown Device';
        
        // الحد الأقصى للأجهزة المسموحة (3 فقط)
        $maxDevices = 3;
        
        // التحقق من عدد الأجهزة الحالية
        $currentDeviceCount = $user->tokens()->count();
        
        if ($currentDeviceCount >= $maxDevices) {
            // حذف أقدم توكن بناءً على آخر استخدام
            $user->tokens()
                ->orderBy('last_used_at', 'asc')
                ->first()
                ->delete();
        }
        
        // حذف التوكنات القديمة جداً (أكثر من 30 يوم بدون استخدام)
        $user->tokens()
            ->where('last_used_at', '<', now()->subDays(30))
            ->delete();
        
        // إنشاء توكن جديد للجهاز الحالي
        $token = $user->createToken($deviceName)->plainTextToken;
        
        // عدد الأجهزة النشطة
        $activeDevices = $user->tokens()->count();

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => "تم الدخول بنجاح - لديك {$activeDevices} أجهزة نشطة من أصل {$maxDevices}",
            'active_devices' => $activeDevices,
            'max_devices' => $maxDevices
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

    public function updateEmail(Request $request)
    {
        $request->validate([
            'old_email' => 'required|email|exists:users,email',
            'new_email' => 'required|email|unique:users,email',
        ]);

        $user = User::where('email', $request->old_email)->first();

        // التأكد من أن الحساب غير مفعل
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'لا يمكن تعديل البريد الإلكتروني لحساب مفعل بالفعل.'
            ], 400);
        }

        // تحديث البريد الإلكتروني وإنشاء توكن جديد
        $verificationToken = Str::random(60);
        $user->email = $request->new_email;
        $user->verification_token = $verificationToken;
        $user->save();

        // إرسال بريد التحقق للإيميل الجديد
        Mail::to($user->email)->send(new EmailVerification($user, $verificationToken));

        return response()->json([
            'message' => 'تم تحديث البريد الإلكتروني بنجاح. يرجى التحقق من بريدك الجديد لتفعيل الحساب.',
            'new_email' => $user->email
        ]);
    }

    public function getCurrentEmail(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,student_id',
        ]);

        $user = User::where('student_id', $request->student_id)->first();
        
        // التأكد من أن الحساب غير مفعل
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'هذا الحساب مفعل بالفعل.'
            ], 400);
        }

        return response()->json([
            'current_email' => $user->email,
            'name' => $user->name,
            'student_id' => $user->student_id
        ]);
    }

    public function logout(Request $request)
    {
        // حذف التوكن الحالي فقط
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function checkToken(Request $request)
    {
        // للتحقق من صلاحية التوكن
        return response()->json([
            'valid' => true,
            'user' => $request->user()
        ]);
    }
}