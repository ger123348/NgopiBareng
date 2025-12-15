<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Cafe;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cafe_id' => 'required|exists:cafes,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $exists = Review::where('user_id', $request->user()->id)
            ->where('cafe_id', $request->cafe_id)->exists();

        if ($exists) {
            return response()->json(['message' => 'You already reviewed this cafe'], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'cafe_id' => $request->cafe_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $this->updateCafeRating($request->cafe_id);

        return response()->json($review);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rating' => 'integer|min:1|max:5',
            'comment' => 'string',
        ]);

        $review->update($request->only(['rating', 'comment']));
        $this->updateCafeRating($review->cafe_id);

        return response()->json($review);
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cafeId = $review->cafe_id;
        $review->delete();
        $this->updateCafeRating($cafeId);

        return response()->json(['message' => 'Deleted']);
    }

    public function adminDestroy($id)
    {
        $review = Review::findOrFail($id);
        $cafeId = $review->cafe_id;
        $review->delete();
        $this->updateCafeRating($cafeId);
        return response()->json(['message' => 'Deleted by admin']);
    }

    private function updateCafeRating($cafeId)
    {
        $cafe = Cafe::findOrFail($cafeId);
        $avg = $cafe->reviews()->avg('rating');
        $cafe->update(['rating' => $avg ?: 0]);
    }
}
