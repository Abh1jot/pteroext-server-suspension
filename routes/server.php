<?php

use Illuminate\Support\Facades\Route;
use ServerSuspension\Http\Controllers\SuspensionClientController;

Route::get('/status', [SuspensionClientController::class, 'getServerStatus']);
