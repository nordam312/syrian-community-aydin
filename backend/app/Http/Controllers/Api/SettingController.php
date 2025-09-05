<?php

namespace App\Http\Controllers\Api;

use App\Models\Setting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required',
            'settings.*.type' => 'nullable|string|in:string,boolean,integer,json',
            'settings.*.group' => 'nullable|string',
            'settings.*.description' => 'nullable|string'
        ]);

        foreach ($request->settings as $setting) {
            Setting::set(
                $setting['key'],
                $setting['value'],
                $setting['type'] ?? 'string',
                $setting['group'] ?? 'general',
                $setting['description'] ?? null
            );
        }

        return response()->json([
            'message' => 'تم تحديث الإعدادات بنجاح'
        ]);
    }

    public function getGroup($group)
    {
        $settings = Setting::getGroup($group);
        return response()->json($settings);
    }

    public function get($key)
    {
        $value = Setting::get($key);
        return response()->json(['value' => $value]);
    }

    public function set(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required',
            'type' => 'nullable|string|in:string,boolean,integer,json',
            'group' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        Setting::set(
            $request->key,
            $request->value,
            $request->type ?? 'string',
            $request->group ?? 'general',
            $request->description ?? null
        );

        return response()->json([
            'message' => 'تم حفظ الإعداد بنجاح'
        ]);
    }

    public function delete($key)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'الإعداد غير موجود'
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'message' => 'تم حذف الإعداد بنجاح'
        ]);
    }




// ===============================================================================================



    // إعدادات خاصة بالموقع
    public function getSiteSettings()
    {
        $settings = [
            'site_name' => Setting::get('site_name', 'المجتمع السوري في أيدن'),
            'site_description' => Setting::get('site_description', 'مجتمع داعم للطلاب السوريين في أيدن'),
            'contact_email' => Setting::get('contact_email'),
            'contact_phone' => Setting::get('contact_phone'),
            'contact_address' => Setting::get('contact_address'),
            'social_facebook' => Setting::get('social_facebook'),
            'social_instagram' => Setting::get('social_instagram'),
            'social_telegram' => Setting::get('social_telegram'),
            'enable_registration' => Setting::get('enable_registration', true),
            'email_verification' => Setting::get('email_verification', false),
            'maintenance_mode' => Setting::get('maintenance_mode', false),
            'maintenance_message' => Setting::get('maintenance_message', 'الموقع في وضع الصيانة حالياً. يرجى المحاولة لاحقاً.')
        ];

        return response()->json($settings);
    }

    public function updateSiteSettings(Request $request)
    {
        $request->validate([
            'site_name' => 'nullable|string|max:255',
            'site_description' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'contact_address' => 'nullable|string|max:255',
            'social_facebook' => 'nullable|url',
            'social_instagram' => 'nullable|url',
            'social_telegram' => 'nullable|url',
            'enable_registration' => 'nullable|boolean',
            'email_verification' => 'nullable|boolean',
            'maintenance_mode' => 'nullable|boolean',
            'maintenance_message' => 'nullable|string|max:500'
        ]);

        foreach ($request->all() as $key => $value) {
            if ($value !== null) {
                $type = in_array($key, ['enable_registration', 'email_verification', 'maintenance_mode']) ? 'boolean' : 'string';
                Setting::set($key, $value, $type, 'site');
            }
        }

        return response()->json([
            'message' => 'تم تحديث إعدادات الموقع بنجاح'
        ]);
    }

    // إعدادات عامة للمستخدمين (بدون authentication)
    public function getPublicSettings()
    {
        $settings = [
            'maintenance_mode' => Setting::get('maintenance_mode', false),
            'maintenance_message' => Setting::get('maintenance_message', 'الموقع في وضع الصيانة حالياً. يرجى المحاولة لاحقاً.'),
            'site_name' => Setting::get('site_name', 'المجتمع السوري في أيدن'),
            'site_description' => Setting::get('site_description', 'مجتمع داعم للطلاب السوريين في أيدن'),
            'enable_registration' => Setting::get('enable_registration', true),
            'email_verification' => Setting::get('email_verification', false)
        ];

        return response()->json($settings);
    }
}