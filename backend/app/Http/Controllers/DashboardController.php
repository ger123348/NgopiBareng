<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cafe;
use App\Models\Review;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        return [
            'total_cafes' => Cafe::count(),
            'pending_cafes' => Cafe::where('status', 'pending')->count(),
            'total_reviews' => Review::count(),
            'total_users' => User::count(),
        ];
    }
}
