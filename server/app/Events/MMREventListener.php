<?php
namespace App\Listeners;

use App\Events\ProjectUpdated;
use App\Events\CourseEnrollmentUpdated;
use App\Events\WorkHistoryUpdated;
use App\Services\MMRService;

class MMREventListener
{
    protected $mmrService;

    public function __construct(MMRService $mmrService)
    {
        $this->mmrService = $mmrService;
    }

    public function handleProjectUpdated(ProjectUpdated $event)
    {
        $this->mmrService->updateMMRForProject($event->project);
    }

    public function handleCourseEnrollmentUpdated(CourseEnrollmentUpdated $event)
    {
        $this->mmrService->updateMMRForCourse($event->enrollment);
    }

    public function handleWorkHistoryUpdated(WorkHistoryUpdated $event)
    {
        $this->mmrService->updateMMRForWorkHistory($event->history);
    }
}