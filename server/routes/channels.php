<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('video-call.{id}', function ($user, $id) {
    $authorized = (int) $user->id === (int) $id;
    Log::info('Channel authorization attempt', [
        'user_id' => $user->id,
        'channel_id' => $id,
        'authorized' => $authorized,
    ]);
    return $authorized;
});