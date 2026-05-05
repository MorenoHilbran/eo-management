<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

require __DIR__.'/settings.php';
