<?php

use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\DecisionSessionController;
use App\Http\Controllers\Api\VisitorController;
use App\Http\Controllers\Api\WheelSpinController;
use Illuminate\Support\Facades\Route;

Route::get('/content/decision-lab', [ContentController::class, 'decisionLab']);
Route::get('/content/wheel', [ContentController::class, 'wheel']);

Route::post('/visitors', [VisitorController::class, 'store']);

Route::post('/decision-sessions', [DecisionSessionController::class, 'store']);
Route::patch('/decision-sessions/{decisionSession}', [DecisionSessionController::class, 'update']);
Route::get('/decision-sessions/{decisionSession}/options', [DecisionSessionController::class, 'options']);
Route::post('/decision-sessions/{decisionSession}/decision', [DecisionSessionController::class, 'decide']);
Route::post('/decision-sessions/{decisionSession}/handoff', [DecisionSessionController::class, 'handoff']);

Route::post('/wheel/spins', [WheelSpinController::class, 'store']);
Route::post('/wheel/spins/{wheelSpin}/answer', [WheelSpinController::class, 'answer']);
Route::post('/wheel/spins/{wheelSpin}/handoff', [WheelSpinController::class, 'handoff']);
