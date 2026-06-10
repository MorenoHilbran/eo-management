<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventTimeplan extends Model
{
    use HasFactory;

    protected $table = 'event_timeplans';

    protected $fillable = [
        'event_id',
        'day_offset',
        'time_start',
        'time_end',
        'activity',
        'pic',
        'notes',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
