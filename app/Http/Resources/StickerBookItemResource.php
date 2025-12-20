<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StickerBookItemResource extends JsonResource
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
            'user_id' => $this->user_id,
            'user_prize_id' => $this->user_prize_id,
            'position_x' => $this->position_x,
            'position_y' => $this->position_y,
            'scale' => (float) $this->scale,
            'rotation' => (float) $this->rotation,
            'userPrize' => new UserPrizeResource($this->whenLoaded('userPrize')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
