<?php

namespace App\Models;

use Database\Factories\VendorFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Vendor extends Model
{
    /** @use HasFactory<VendorFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'contact_person',
        'email',
        'phone',
        'address',
        'rating',
        'status',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(VendorCategory::class);
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_vendor')
                    ->withPivot('contract_amount', 'status', 'notes')
                    ->withTimestamps();
    }
}

