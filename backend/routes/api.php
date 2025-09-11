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
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\UserQuestionController;

/*
|--------------------------------------------------------------------------
| API Routes - Public (No Authentication Required)
|--------------------------------------------------------------------------
*/

// Authentication - with rate limiting
Route::middleware(['throttle:5,1','web'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
    Route::post('/update-email', [AuthController::class, 'updateEmail']);
    Route::post('/get-current-email', [AuthController::class, 'getCurrentEmail']);
    
    // Password Reset Routes
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail'])->name('verification.verify');


// Content & Settings
Route::get('/content', [ContentController::class, 'index']);
Route::get('/settings/public', [SettingController::class, 'getPublicSettings']);

// Banners & Logos
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/banners/{id}', [BannerController::class, 'show']);
Route::get('/logos', [LogoController::class, 'index']);
Route::get('/logos/active', [LogoController::class, 'active']);
Route::get('/logos/{id}', [LogoController::class, 'show']);

// Events
Route::apiResource('events', EventController::class);

// FAQ
Route::get('faqs', [FAQController::class, 'index']);
Route::get('faqs/{faq}', [FAQController::class, 'show']);

// Elections
Route::get('/elections', [ElectionController::class, 'index']);
Route::get('elections/{election}/results', [ElectionController::class, 'results']);

// User Questions
Route::get('user-questions', [UserQuestionController::class, 'index']);

/*
|--------------------------------------------------------------------------
| API Routes - Authenticated Users (Require Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware(['web'])->group(function () {
    // Authentication - تحتاج فقط web middleware للـ session
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Routes that require authentication (session-based)
Route::middleware(['web', 'auth'])->group(function () {
    // Events
    Route::post('/events/{event}/attendees', [EventController::class, 'addAttendee']);
    Route::delete('/events/{event}/attendees', [EventController::class, 'removeAttendee']);
    Route::put('/events/{event}/attendees/status', [EventController::class, 'updateAttendeeStatus']);
    Route::get('/events/{event}/attendees', [EventController::class, 'attendees']);

    // Elections
    Route::prefix('elections')->group(function () {
        Route::get('/{election}/candidates', [ElectionController::class, 'candidates']);
        Route::post('/{election}/vote', [ElectionController::class, 'vote']);
    });

    // User Questions
    Route::post('user-questions', [UserQuestionController::class, 'store']);
    Route::post('user-questions/{id}/vote', [UserQuestionController::class, 'vote']);
});

/*
|--------------------------------------------------------------------------
| API Routes - Admin Only (Require Authentication & Admin Role)
|--------------------------------------------------------------------------
*/
Route::middleware(['web', 'auth', 'admin'])->group(function () {
    // Dashboard & Statistics
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/user-stats', [DashboardController::class, 'userStats']);
    Route::get('/dashboard/event-stats', [DashboardController::class, 'eventStats']);

    // User Management
    Route::apiResource('users', UserController::class);
    Route::get('users/stats', [UserController::class, 'stats']);

    // Content Management
    Route::prefix('content')->group(function () {
        Route::put('/', [ContentController::class, 'update']);
        Route::put('/home', [ContentController::class, 'updateHome']);
        Route::put('/about', [ContentController::class, 'updateAbout']);
        Route::put('/contact', [ContentController::class, 'updateContact']);
        Route::put('/social', [ContentController::class, 'updateSocial']);
    });

    // Settings Management
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::put('/', [SettingController::class, 'update']);
        Route::get('/{group}', [SettingController::class, 'getGroup']);
        Route::get('/key/{key}', [SettingController::class, 'get']);
        Route::post('/', [SettingController::class, 'set']);
        Route::delete('/{key}', [SettingController::class, 'delete']);
        Route::get('/site', [SettingController::class, 'getSiteSettings']);
        Route::put('/site', [SettingController::class, 'updateSiteSettings']);
    });

    // Banner Management
    Route::prefix('banners')->group(function () {
        Route::post('/', [BannerController::class, 'store']);
        Route::post('/{id}', [BannerController::class, 'update']);
        Route::delete('/{id}', [BannerController::class, 'destroy']);
    });

    // Logo Management
    Route::prefix('logos')->group(function () {
        Route::post('/', [LogoController::class, 'store']);
        Route::post('/{logo}', [LogoController::class, 'update']);
        Route::delete('/{logo}', [LogoController::class, 'destroy']);
    });

    // FAQ Management
    Route::prefix('faqs')->group(function () {
        Route::post('/', [FAQController::class, 'store']);
        Route::post('/{faq}', [FAQController::class, 'update']);
        Route::delete('/{faq}', [FAQController::class, 'destroy']);
    });

    // Election Management
    Route::prefix('elections')->group(function () {
        Route::post('/create', [ElectionController::class, 'store']);
        Route::post('/{election}/candidates', [ElectionController::class, 'addCandidate']);
        Route::post('/{election}/update', [ElectionController::class, 'updateElection']);
        Route::delete('/{election}', [ElectionController::class, 'destroyElection']);
        Route::post('/candidates/{candidate}/update', [ElectionController::class, 'updateCandidate']);
        Route::delete('/candidates/{candidate}', [ElectionController::class, 'destroyCandidate']);
    });

    // User Questions Management
    Route::prefix('admin/user-questions')->group(function () {
        Route::get('/', [UserQuestionController::class, 'adminIndex']);
        Route::post('/{id}/answer', [UserQuestionController::class, 'adminAnswer']);
        Route::delete('/{id}', [UserQuestionController::class, 'adminDestroy']);
    });
});