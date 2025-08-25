<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\LogoController;

// Routes للمصادقة (عامة)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes للمستخدمين المسجلين
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // إدارة الفعاليات للمستخدمين
    Route::post('/events/{event}/attendees', [EventController::class, 'addAttendee']);
    Route::delete('/events/{event}/attendees', [EventController::class, 'removeAttendee']);
});

// Routes للإدارة (تحتاج صلاحيات admin)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // لوحة التحكم
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/user-stats', [DashboardController::class, 'userStats']);
    Route::get('/dashboard/event-stats', [DashboardController::class, 'eventStats']);

    // إدارة الأعضاء
    Route::apiResource('users', UserController::class);
    Route::get('users/stats', [UserController::class, 'stats']);


    // إدارة المحتوى
    Route::get('content', [ContentController::class, 'index']);
    Route::put('content', [ContentController::class, 'update']);
    Route::put('content/home', [ContentController::class, 'updateHome']);
    Route::put('content/about', [ContentController::class, 'updateAbout']);
    Route::put('content/contact', [ContentController::class, 'updateContact']);
    Route::put('content/social', [ContentController::class, 'updateSocial']);

    // إدارة الإعدادات
    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings', [SettingController::class, 'update']);
    Route::get('settings/{group}', [SettingController::class, 'getGroup']);
    Route::get('settings/key/{key}', [SettingController::class, 'get']);
    Route::post('settings', [SettingController::class, 'set']);
    Route::delete('settings/{key}', [SettingController::class, 'delete']);
    Route::get('settings/site', [SettingController::class, 'getSiteSettings']);
    Route::put('settings/site', [SettingController::class, 'updateSiteSettings']);
    
    // إدارة الشعارات (Logos)
    
});

// Routes عامة (لا تحتاج مصادقة)
Route::get('/content/public', [ContentController::class, 'index']);
Route::get('/settings/public', [SettingController::class, 'getSiteSettings']);

// Routes for banners
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/banners/{id}', [BannerController::class, 'show']);

// Routes عامة للشعارات
Route::get('/logos', [LogoController::class, 'index']);
Route::get('/logos/active', [LogoController::class, 'active']);
Route::get('/logos/{id}', [LogoController::class, 'show']);

// Routes للإدارة (إضافة/تعديل/حذف)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/logos', [LogoController::class, 'store']);
    Route::put('/logos/{logo}', [LogoController::class, 'update']);
    Route::delete('/logos/{logo}', [LogoController::class, 'destroy']);
});

// Admin-only routes for banners
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/banners', [BannerController::class, 'store']);
    Route::put('/banners/{id}', [BannerController::class, 'update']);
    Route::delete('/banners/{id}', [BannerController::class, 'destroy']);
});

Route::apiResource('events', EventController::class);
Route::put('/events/{event}/attendees/status', [EventController::class, 'updateAttendeeStatus']);
Route::get('/events/{event}/attendees', [EventController::class, 'attendees']);