<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserPrizeResource extends JsonResource
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
            'prize_id' => $this->prize_id,
            'rarity' => $this->rarity,
            'obtained_at' => $this->obtained_at,
            'prize' => new PrizeResource($this->whenLoaded('prize')),
        ];
    }
}
