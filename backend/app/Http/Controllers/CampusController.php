<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campus;

class CampusController extends Controller
{
    public function index()
    {
        return Campus::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:campuses,name',
            'image' => 'nullable|image|max:2048'
        ]);

        $data = ['name' => $request->name, 'slug' => \Illuminate\Support\Str::slug($request->name)];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('campuses', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $campus = Campus::create($data);
        return response()->json($campus, 201);
    }
}
