<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cafe;
use App\Models\CafeImage;
use Illuminate\Support\Facades\Storage;

class CafeController extends Controller
{
    public function index(Request $request)
    {
        $query = Cafe::with('images', 'campuses');

        // Campus filter
        if ($request->has('campus_id')) {
            $query->whereHas('campuses', function ($q) use ($request) {
                $q->where('campuses.id', $request->campus_id);
            });
        }

        // Status filter
        $user = auth('sanctum')->user();
        if ($user && $user->role === 'admin') {
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('status', 'approved');
        }

        // Price filter
        if ($request->has('price_category')) {
            $query->where('price_category', $request->price_category);
        }

        // Rating filter
        if ($request->has('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        // Facilities filter
        if ($request->has('facilities')) {
            $facilities = explode(',', $request->facilities);
            foreach ($facilities as $facility) {
                $query->whereJsonContains('facilities', $facility);
            }
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->sort;
            if ($sort === 'rating') {
                $query->orderByDesc('rating');
            } elseif ($sort === 'nearest') {
                $query->inRandomOrder(); // Dummy nearest
            } else {
                $query->latest();
            }
        } else {
            $query->latest();
        }

        return $query->get();
    }

    public function show($id)
    {
        $cafe = Cafe::with(['images', 'reviews.user', 'campuses', 'menuItems'])->findOrFail($id);
        return $cafe;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'address' => 'required|string',
            'price_category' => 'required|in:murah,sedang,mahal',
            'facilities' => 'array',
            'campus_ids' => 'required|array',
            'images' => 'required|array|min:3',
            'images.*' => 'image|max:2048',
        ]);

        $cafe = Cafe::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'address' => $request->address,
            'price_category' => $request->price_category,
            'facilities' => $request->facilities,
            'status' => 'pending',
        ]);

        $cafe->campuses()->attach($request->campus_ids);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cafes', 'public');
                CafeImage::create([
                    'cafe_id' => $cafe->id,
                    'image_path' => '/storage/' . $path,
                ]);
            }
        }

        return response()->json($cafe, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $cafe = Cafe::findOrFail($id);
        $request->validate(['status' => 'required|in:approved,rejected,hidden']);
        $cafe->update(['status' => $request->status]);

        return response()->json($cafe);
    }

    public function destroy($id)
    {
        $cafe = Cafe::findOrFail($id);

        // Delete images from storage
        foreach ($cafe->images as $image) {
            // Basic replacement of /storage/ to public/
            $path = str_replace('/storage/', '', $image->image_path);
            Storage::disk('public')->delete($path);
        }

        $cafe->delete();
        return response()->json(['message' => 'Cafe deleted']);
    }
}
