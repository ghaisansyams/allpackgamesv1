<?php

use App\Http\Controllers\JoinController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Hub');
})->name('hub');

// Visitor-facing: opened on the visitor's own phone after scanning the QR code shown on the
// booth touch screen, so biodata is typed on a phone keyboard instead of a big screen.
Route::get('/join/{token}', [JoinController::class, 'show'])->name('join.show');
Route::post('/join/{token}', [JoinController::class, 'store'])->name('join.store');
Route::get('/join/{token}/thanks', [JoinController::class, 'thanks'])->name('join.thanks');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
