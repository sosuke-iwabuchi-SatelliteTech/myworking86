<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GachaHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'prize_id',
        'rarity',
        'consumed_points',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
