<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Serve frontend files in production on Railway
if (php_sapi_name() !== 'cli-server') {
    $uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    
    // Check if request is for API, storage, or backend routes
    if (strpos($uri, '/api') !== 0 && strpos($uri, '/storage') !== 0) {
        // Path to frontend build files
        $frontendPath = __DIR__ . '/../../frontend/dist' . $uri;
        
        // Serve static files if they exist
        if ($uri !== '/' && file_exists($frontendPath) && !is_dir($frontendPath)) {
            return false; // Let PHP handle the file serving
        }
        
        // Serve index.html for SPA routes
        $indexPath = __DIR__ . '/../../frontend/dist/index.html';
        if (!file_exists($frontendPath) && file_exists($indexPath)) {
            header('Content-Type: text/html');
            readfile($indexPath);
            exit;
        }
    }
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
