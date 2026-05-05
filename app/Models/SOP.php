<?php

namespace App\Models;

use Database\Factories\SOPFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SOP extends Model
{
    /** @use HasFactory<SOPFactory> */
    use HasFactory;

    protected $table = 'sops';

    protected $fillable = [
        'name',
        'category',
        'description',
        'content',
        'file_path',
        'created_by',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

