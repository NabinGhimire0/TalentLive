<?php

use App\Http\Middleware\JwtMiddleware;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('video-call.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
