<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'image'];

    public function cafes()
    {
        return $this->belongsToMany(Cafe::class, 'campus_cafe');
    }
}
