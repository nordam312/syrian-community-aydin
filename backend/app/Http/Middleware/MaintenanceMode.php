<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Setting;

class MaintenanceMode
{
    public function handle(Request $request, Closure $next)
    {
        // التحقق من وضع الصيانة
        $maintenanceMode = Setting::get('maintenance_mode', false);
        
        if ($maintenanceMode && !$this->isExempt($request)) {
            // إذا كان الطلب JSON (من الفرونت إند)
            if ($request->expectsJson() || $request->header('Accept') === 'application/json') {
                return response()->json([
                    'message' => 'الموقع في وضع الصيانة حالياً. يرجى المحاولة لاحقاً.',
                    'maintenance_mode' => true
                ], 503);
            }
            
            // للطلبات العادية - عرض صفحة الصيانة
            $maintenanceMessage = Setting::get('maintenance_message', 'الموقع في وضع الصيانة حالياً. نعتذر عن الإزعاج.');
            
            return response(view('maintenance', [
                'message' => $maintenanceMessage
            ]), 503);
        }

        return $next($request);
    }

    /**
     * تحديد الطلبات المستثناة من وضع الصيانة
     */
    private function isExempt(Request $request): bool
    {
        // السماح لطلبات تسجيل الدخول والخروج والإعدادات العامة
        $exemptRoutes = [
            'api/login',
            'api/logout', 
            'api/verify-email/*',
            'api/settings/public',
        ];

        $path = $request->path();
        
        foreach ($exemptRoutes as $route) {
            if ($path === $route || 
                (str_contains($route, '*') && str_starts_with($path, str_replace('*', '', $route)))) {
                return true;
            }
        }

        // السماح للمدراء بالوصول
        if ($request->user() && $request->user()->role === 'admin') {
            return true;
        }

        return false;
    }
}