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
        //
    })->create();
