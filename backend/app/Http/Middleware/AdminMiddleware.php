<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // التحقق من وجود مستخدم مسجل
        if (!$request->user()) {
            return response()->json([
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        // التحقق من كون المستخدم مسؤول
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'ليس لديك صلاحيات للوصول لهذه الصفحة'
            ], 403);
        }

        return $next($request);
    }
}