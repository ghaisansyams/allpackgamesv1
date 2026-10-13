<?php

namespace App\Providers;

use Illuminate\Foundation\DevCommands;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Behind a reverse proxy (e.g. Vercel's edge) TLS is terminated before the request
        // reaches the app, so Laravel sees a plain-HTTP request and would otherwise emit
        // http:// asset/Vite URLs — the browser then blocks them as mixed content on an
        // https:// page.
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        // The QR/phone join flow depends on Reverb to notify the booth screen the instant a
        // visitor submits their details, so `composer run dev` / `php artisan dev` must start
        // it alongside serve/vite — it's not one of Laravel's built-in dev defaults.
        DevCommands::artisan('reverb:start --no-interaction', 'reverb');
    }
}
