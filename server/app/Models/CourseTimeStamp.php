<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseTimeStamp extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',  'user_id', 'skipped_from', 'skipped_to', 'paused_at', 'resumed_at', 'completed_at',
    ];

    protected $casts = [
        'skipped_from' => 'datetime',
        'skipped_to' => 'datetime',
        'paused_at' => 'datetime',
        'resumed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}