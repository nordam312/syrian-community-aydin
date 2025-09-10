<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
          // إضافة CORS middleware لمجموعة API
        $middleware->api(prepend: [
            HandleCors::class, // ← أضف هذا السطر
        ]);
        
        // إضافة CORS middleware لمجموعة Web أيضاً إذا needed
        $middleware->web(prepend: [
            HandleCors::class, // ← اختياري للـ web
        ]);
        
        // إضافة middleware وضع الصيانة للطلبات العامة
        $middleware->web(append: [
            \App\Http\Middleware\MaintenanceMode::class,
        ]);
        
        $middleware->api(append: [
            // \App\Http\Middleware\MaintenanceMode::class,
        ]);
        
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'maintenance' => \App\Http\Middleware\MaintenanceMode::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Customize exception handling to prevent information leakage
        $exceptions->renderable(function (\Exception $e, $request) {
            if ($request->is('api/*')) {
                // For production, hide sensitive error details
                if (app()->environment('production')) {
                    if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                        return response()->json(['message' => 'Resource not found'], 404);
                    }
                    
                    if ($e instanceof \Illuminate\Validation\ValidationException) {
                        return response()->json([
                            'message' => 'Validation failed',
                            'errors' => $e->errors()
                        ], 422);
                    }
                    
                    if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                        return response()->json(['message' => 'Endpoint not found'], 404);
                    }
                    
                    if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                        return response()->json(['message' => 'Unauthenticated'], 401);
                    }
                    
                    // Generic error message for all other exceptions in production
                    return response()->json([
                        'message' => 'An error occurred. Please try again later.'
                    ], 500);
                }
            }
        });
    })->create();
