<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \App\Events\ProjectUpdated::class => [
            \App\Listeners\MMREventListener::class . '@handleProjectUpdated',
        ],
        \App\Events\CourseEnrollmentUpdated::class => [
            \App\Listeners\MMREventListener::class . '@handleCourseEnrollmentUpdated',
        ],
        \App\Events\WorkHistoryUpdated::class => [
            \App\Listeners\MMREventListener::class . '@handleWorkHistoryUpdated',
        ],
    ];
    public function register(): void
    {
        parent::register();
    }
}
