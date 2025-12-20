<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StickerBookItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'user_prize_id',
        'position_x',
        'position_y',
        'scale',
        'rotation',
        'z_index',
    ];

    protected $casts = [
        'position_x' => 'integer',
        'position_y' => 'integer',
        'scale' => 'decimal:2',
        'rotation' => 'decimal:2',
        'z_index' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userPrize(): BelongsTo
    {
        return $this->belongsTo(UserPrize::class);
    }
}
