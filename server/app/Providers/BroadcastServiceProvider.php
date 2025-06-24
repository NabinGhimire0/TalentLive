<?php

namespace App\Providers;

use App\Http\Middleware\JwtMiddleware;
use GuzzleHttp\Middleware;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    public function boot()
{
    Broadcast::routes(['middleware' => ['jwt.auth']]);

    require base_path('routes/channels.php');
}
}
