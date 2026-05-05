<?php

namespace App\Models;

use Database\Factories\RABItemFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RABItem extends Model
{
    /** @use HasFactory<RABItemFactory> */
    use HasFactory;

    protected $table = 'rab_items';

    protected $fillable = [
        'event_id',
        'name',
        'unit',
        'quantity',
        'unit_price',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}

