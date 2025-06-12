<?php
namespace App\Services;

use App\Models\CourseEnrollment;
use App\Models\Education;
use App\Models\MMR;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MMRService
{
    protected $baseMMR = 500;
    protected $mmrCap = 10000;
    protected $skillMMRCap = 2000;
    protected $decayRate = 10;
    protected $githubMMRCap = 500;

    public function initializeMMR(User $user): MMR
    {
        if ($user->mmr) {
            return $user->mmr;
        }

        $skills = $user->skills->pluck('id')->mapWithKeys(function ($skillId) {
            return [$skillId => $this->baseMMR];
        })->toArray();

        $categories = $user->skills->pluck('category_id')->unique()->mapWithKeys(function ($categoryId) {
            return [$categoryId => $this->baseMMR];
        })->toArray();

        return MMR::create([
            'user_id' => $user->id,
            'mmr' => $this->baseMMR * count($skills),
            'categories' => $categories,
            'skills' => $skills,
            'github' => 0,
        ]);
    }

    public function recalculateMMR(User $user): MMR
    {
        $mmr = $user->mmr ?? $this->initializeMMR($user);

        $skillMMR = [];
        $categoryMMR = [];

        // Projects
        $projects = $user->projects()->where('status', 'completed')->get();
        foreach ($projects as $project) {
            foreach ($project->skills ?? [] as $skillId) {
                $skillMMR[$skillId] = ($skillMMR[$skillId] ?? $this->baseMMR) + 50;
                $skill = Skill::find($skillId);
                if ($skill) {
                    $categoryMMR[$skill->category_id] = ($categoryMMR[$skill->category_id] ?? $this->baseMMR) + 50;
                }
            }
        }

        // Courses
        $enrollments = $user->enrollments()->whereHas('timeStamp', function ($query) {
            $query->whereNotNull('completed_at');
        })->with('course')->get();
        foreach ($enrollments as $enrollment) {
            foreach ($enrollment->course->skills ?? [] as $skillId) {
                $skillMMR[$skillId] = ($skillMMR[$skillId] ?? $this->baseMMR) + 30;
                $skill = Skill::find($skillId);
                if ($skill) {
                    $categoryMMR[$skill->category_id] = ($categoryMMR[$skill->category_id] ?? $this->baseMMR) + 30;
                }
            }
        }

        // Work Histories
        $workHistories = $user->workHistories()->where('verified', true)->get();
        foreach ($workHistories as $history) {
            foreach ($user->skills->pluck('id') as $skillId) {
                $skillMMR[$skillId] = ($skillMMR[$skillId] ?? $this->baseMMR) + 100;
                $skill = Skill::find($skillId);
                if ($skill) {
                    $categoryMMR[$skill->category_id] = ($categoryMMR[$skill->category_id] ?? $this->baseMMR) + 100;
                }
            }
        }

        // Educations
        $educations = $user->educations()->where('verified', true)->get();
        foreach ($educations as $education) {
            $skillMMR[$education->id] = ($skillMMR[$education->id] ?? $this->baseMMR) + 50; // Base points for education
            foreach ($education->skills ?? [] as $skillId) {
                $skillMMR[$skillId] = ($skillMMR[$skillId] ?? $this->baseMMR) + 20;
                $skill = Skill::find($skillId);
                if ($skill) {
                    $categoryMMR[$skill->category_id] = ($categoryMMR[$skill->category_id] ?? $this->baseMMR) + 20;
                }
            }
        }

        // Cap skill MMR
        foreach ($skillMMR as &$value) {
            $value = min($value, $this->skillMMRCap);
        }

        // Apply decay
        $lastActivity = $user->projects()->latest('updated_at')->first()?->updated_at ??
                        $user->enrollments()->latest('created_at')->first()?->created_at ??
                        $user->workHistories()->latest('updated_at')->first()?->updated_at ??
                        $user->educations()->latest('updated_at')->first()?->updated_at ??
                        Carbon::now();
        $monthsInactive = Carbon::now()->diffInMonths($lastActivity);
        foreach ($skillMMR as &$value) {
            $value = max(0, $value - ($monthsInactive * $this->decayRate));
        }
        foreach ($categoryMMR as &$value) {
            $value = max(0, $value - ($monthsInactive * $this->decayRate));
        }

        // GitHub MMR
        $githubMMR = $this->calculateGithubMMR($user);

        // Total MMR
        $totalMMR = array_sum($skillMMR) + $githubMMR;

        $mmr->update([
            'mmr' => min($totalMMR, $this->mmrCap),
            'categories' => $categoryMMR,
            'skills' => $skillMMR,
            'github' => $githubMMR,
        ]);

        return $mmr;
    }

    public function calculateGithubMMR(User $user): int
    {
        if (!$user->github_id) {
            return 0;
        }

        try {
            $response = Http::withToken(config('services.github.token'))
                           ->get("https://api.github.com/users/{$user->github_id}/events");
            if ($response->failed()) {
                Log::error('GitHub API request failed', ['user_id' => $user->id, 'status' => $response->status()]);
                return $user->mmr->github ?? 0;
            }

            $events = $response->json();
            $githubMMR = 0;

            foreach ($events as $event) {
                $createdAt = Carbon::parse($event['created_at']);
                if ($createdAt->diffInMonths(Carbon::now()) < 1) {
                    if ($event['type'] === 'PushEvent') {
                        $githubMMR += count($event['payload']['commits'] ?? []);
                    } elseif ($event['type'] === 'PullRequestEvent' && $event['payload']['action'] === 'opened') {
                        $githubMMR += 5;
                    }
                }
            }

            return min($githubMMR, $this->githubMMRCap);
        } catch (\Exception $e) {
            Log::error('GitHub MMR calculation failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            return $user->mmr->github ?? 0;
        }
    }

    public function updateMMRForProject(Project $project): void
    {
        if ($project->status === 'completed') {
            $this->recalculateMMR($project->user);
        }
    }

    public function updateMMRForCourse(CourseEnrollment $enrollment): void
    {
        if ($enrollment->timeStamp && $enrollment->timeStamp->completed_at) {
            $this->recalculateMMR($enrollment->user);
        }
    }

    public function updateMMRForWorkHistory(WorkHistory $history): void
    {
        if ($history->verified) {
            $this->recalculateMMR($history->user);
        }
    }

    public function updateMMRForEducation(Education $education): void
    {
        if ($education->verified) {
            $this->recalculateMMR($education->user);
        }
    }
}