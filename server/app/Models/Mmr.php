<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MMR extends Model
{
    protected $table = 'mmrs';
    use HasFactory;

    protected $fillable = ['user_id', 'mmr', 'categories', 'skills', 'github'];

    protected $casts = [
        'categories' => 'array',
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
