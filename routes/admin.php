<?php

use Illuminate\Support\Facades\Route;
use ServerSuspension\Http\Controllers\SuspensionController;

Route::get('/overview', [SuspensionController::class, 'getOverview']);
Route::post('/schedule', [SuspensionController::class, 'updateSchedule']);
Route::post('/bulk-schedule', [SuspensionController::class, 'bulkSchedule']);
Route::post('/action', [SuspensionController::class, 'executeAction']);
Route::post('/process-due', [SuspensionController::class, 'processDue']);
Route::get('/mail-templates', [SuspensionController::class, 'getMailTemplates']);
Route::post('/mail-templates', [SuspensionController::class, 'updateMailTemplates']);
Route::post('/test-mail', [SuspensionController::class, 'sendTestMail']);

