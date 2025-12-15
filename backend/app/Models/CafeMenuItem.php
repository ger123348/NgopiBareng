<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CafeMenuItem extends Model
{
    protected $fillable = ['cafe_id', 'name', 'category', 'price'];

    public function cafe()
    {
        return $this->belongsTo(Cafe::class);
    }
}
