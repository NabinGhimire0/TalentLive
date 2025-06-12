<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'company_id', 'position', 'responsibilities', 'type', 'start_date', 'end_date', 'verified',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }
}