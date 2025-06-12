<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id', 'skills', 'title', 'description', 'price', 'video',
    ];

    protected $casts = [
        'skills' => 'array',
        'price' => 'decimal:2',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function timeStamps()
    {
        return $this->hasMany(CourseTimeStamp::class);
    }
}