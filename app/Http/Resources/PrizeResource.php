<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrizeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Services\ImageUrlService $imageUrlService */
        $imageUrlService = app(\App\Services\ImageUrlService::class);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'rarity' => $this->rarity,
            'description' => $this->description,
            'imageUrl' => $imageUrlService->getUrl($this->image_url, $this->updated_at),
        ];
    }
}
