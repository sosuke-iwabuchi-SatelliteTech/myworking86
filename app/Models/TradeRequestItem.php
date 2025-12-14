<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TradeRequestItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'trade_request_id',
        'user_prize_id',
        'owner_id',
        'type',
    ];

    const TYPE_OFFER = 'offer';
    const TYPE_REQUEST = 'request';

    public function tradeRequest(): BelongsTo
    {
        return $this->belongsTo(TradeRequest::class);
    }

    public function userPrize(): BelongsTo
    {
        return $this->belongsTo(UserPrize::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
