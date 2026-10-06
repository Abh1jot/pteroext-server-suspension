<?php

use Illuminate\Support\Facades\Route;
use ServerSuspension\Http\Controllers\SuspensionClientController;

Route::get('/server/{server}/status', [SuspensionClientController::class, 'getServerStatus']);
