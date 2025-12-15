<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cafe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'price_category',
        'facilities',
        'rating',
        'status'
    ];

    protected $casts = [
        'facilities' => 'array',
        'rating' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campuses()
    {
        return $this->belongsToMany(Campus::class, 'campus_cafe');
    }

    public function images()
    {
        return $this->hasMany(CafeImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function menuItems()
    {
        return $this->hasMany(CafeMenuItem::class);
    }
}
