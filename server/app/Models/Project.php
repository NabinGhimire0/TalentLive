<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'skills', 'demo', 'project_link', 'duration', 'status',
    ];

    protected $casts = [
        'skills' => 'array',
        'demo' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}