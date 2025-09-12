web: cd backend && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
worker: cd backend && php artisan queue:work --sleep=3 --tries=3
scheduler: cd backend && while true; do php artisan schedule:run --verbose --no-interaction & sleep 60; done