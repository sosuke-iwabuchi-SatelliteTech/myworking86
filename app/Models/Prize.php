<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prize extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'type',
        'rarity',
        'description',
        'image_url',
    ];

    protected $keyType = 'string';
    public $incrementing = false;
    //
}
