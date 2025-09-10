<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // التحقق من وجود مستخدم مسجل باستخدام Auth facade للـ sessions
        if (!Auth::check()) {
            return response()->json([
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        // الحصول على المستخدم من الجلسة
        $user = Auth::user();
        
        // التحقق من كون المستخدم مسؤول
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'ليس لديك صلاحيات للوصول لهذه الصفحة'
            ], 403);
        }

        return $next($request);
    }
}