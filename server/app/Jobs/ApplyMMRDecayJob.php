<?php
namespace App\Jobs;

use App\Models\User;
use App\Services\MMRService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ApplyMMRDecayJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(MMRService $mmrService)
    {
        User::whereHas('mmr')->chunk(100, function ($users) use ($mmrService) {
            foreach ($users as $user) {
                $mmrService->recalculateMMR($user);
            }
        });
    }
}