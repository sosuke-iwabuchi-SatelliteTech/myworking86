<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradeRequestResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'status' => $this->status,
            'message' => $this->message,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'sender' => $this->whenLoaded('sender'), // Should ideally be UserResource, but keeping as model/array for now to minimize scope creep unless needed.
            'receiver' => $this->whenLoaded('receiver'),
            'items' => TradeRequestItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
