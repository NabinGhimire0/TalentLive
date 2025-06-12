<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'location',
        'role',
        'github_id',
        'bio',
        'profile_picture',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills')->withTimestamps();
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class, 'user_id');
    }

    public function workHistories()
    {
        return $this->hasMany(WorkHistory::class, 'user_id');
    }

    public function mmr()
    {
        return $this->hasOne(MMR::class, 'user_id');
    }

    public function companies()
    {
        return $this->hasMany(WorkHistory::class, 'company_id');
    }

    public function educations()
    {
        return $this->hasMany(Education::class);
    }
}
