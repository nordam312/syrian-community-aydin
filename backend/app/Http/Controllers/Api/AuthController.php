<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
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
        ]);

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_id';
        $user = User::where($loginField, $request->login)->first();

        if (!Auth::attempt([$loginField => $request->login, 'password' => $request->password])) {
            throw ValidationException::withMessages([
                'login' => ['المعلومات المدخلة غير صحيحة.'],
            ]);
        }

        $user = Auth::user();
        
        // إنشاء جلسة جديدة للمستخدم
        $request->session()->regenerate();
        
        // 🔥 أهم جزء: ربط الجلسة بالمستخدم في قاعدة البيانات
        DB::table('sessions')
            ->where('id', session()->getId())
            ->update(['user_id' => $user->id]);
        
        // تخزين بيانات المستخدم في الجلسة
        session([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'login_time' => now(),
                
            ]
        ]);

        $maxSessions = 3;
                
        // التحقق من عدد الجلسات النشطة
        $activeSessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->count();

        if ($activeSessions >= $maxSessions) {
            // حذف أقدم جلسة
            $oldestSession = DB::table('sessions')
                ->where('user_id', $user->id)
                ->orderBy('last_activity', 'asc')
                ->first();
                
            if ($oldestSession) {
                DB::table('sessions')
                    ->where('id', $oldestSession->id)
                    ->delete();
                    
                // إعادة حساب الجلسات النشطة بعد الحذف
                $activeSessions = DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->count();
            }
        }

        return response()->json([
            'user' => $user,
            'message' => "تم الدخول بنجاح - لديك {$activeSessions} جلسات نشطة من أصل {$maxSessions}",
            'active_sessions' => $activeSessions,
            'max_sessions' => $maxSessions
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
        try {
            // التحقق من وجود مستخدم مسجل الدخول
            if (Auth::check()) {
                // تسجيل الخروج من الجلسة
                Auth::logout();
            }
            
            // حذف الجلسة من قاعدة البيانات
            if ($request->hasSession()) {
                $sessionId = $request->session()->getId();
                
                // حذف من قاعدة البيانات
                DB::table('sessions')
                    ->where('id', $sessionId)
                    ->delete();
                    
                // تدمير الجلسة
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
            
            return response()->json([
                'message' => 'تم تسجيل الخروج بنجاح',
                'success' => true
            ]);
        } catch (\Exception $e) {
            // في حالة حدوث أي خطأ، نرجع نجاح لأن الهدف هو تسجيل الخروج
            return response()->json([
                'message' => 'تم تسجيل الخروج',
                'success' => true
            ]);
        }
    }

    // في app/Http/Controllers/AuthController.php أو أي controller مناسب
    public function user(Request $request)
    {
        // التحقق إذا كان المستخدم مصادقاً
        if (!Auth::check()) {
            return response()->json([
                'message' => 'غير مصادق',
                'authenticated' => false
            ], 401);
        }

        $user = Auth::user();

        // إرجاع بيانات المستخدم بشكل منظم وآمن
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'phone' => $user->phone,
                'major' => $user->major,
                'role' => $user->role,
                'academic_year' => $user->academic_year,
                // يمكنك إضافة المزيد من الحقول حسب الحاجة
            ],
            'authenticated' => true,
            'message' => 'تم جلب بيانات المستخدم بنجاح'
        ]);
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




