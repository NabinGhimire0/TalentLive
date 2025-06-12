<?php
namespace App\Events;

use App\Models\Project;
use App\Models\CourseEnrollment;
use App\Models\WorkHistory;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectUpdated
{
    use Dispatchable, SerializesModels;
    public $project;
    public function __construct(Project $project)
    {
        $this->project = $project;
    }
}

class CourseEnrollmentUpdated
{
    use Dispatchable, SerializesModels;
    public $enrollment;
    public function __construct(CourseEnrollment $enrollment)
    {
        $this->enrollment = $enrollment;
    }
}

class WorkHistoryUpdated
{
    use Dispatchable, SerializesModels;
    public $history;
    public function __construct(WorkHistory $history)
    {
        $this->history = $history;
    }
}