<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPrize extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'prize_id',
        'rarity',
        'obtained_at',
    ];

    protected $casts = [
        'obtained_at' => 'datetime',
    ];
}
