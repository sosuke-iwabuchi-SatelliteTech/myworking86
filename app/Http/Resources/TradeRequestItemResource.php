<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradeRequestItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'trade_request_id' => $this->trade_request_id,
            'user_prize_id' => $this->user_prize_id,
            'owner_id' => $this->owner_id,
            'type' => $this->type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'userPrize' => new UserPrizeResource($this->whenLoaded('userPrize')),
            'owner' => $this->whenLoaded('owner'), // Assuming UserResource is not critical for this specific task, or we can use generic array if needed. But keeping it flexible.
        ];
    }
}
