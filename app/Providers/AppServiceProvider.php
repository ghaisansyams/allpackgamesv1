<?php

namespace App\Providers;

use Illuminate\Foundation\DevCommands;
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
        Vite::prefetch(concurrency: 3);

        // The QR/phone join flow depends on Reverb to notify the booth screen the instant a
        // visitor submits their details, so `composer run dev` / `php artisan dev` must start
        // it alongside serve/vite — it's not one of Laravel's built-in dev defaults.
        DevCommands::artisan('reverb:start --no-interaction', 'reverb');
    }
}
