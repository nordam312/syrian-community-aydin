<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function __construct()
    {
        // Middleware is handled at route level - no need for controller middleware
    }

    public function index()
    {
        return Banner::all();
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        $imagePath = $request->file('image')->store('banners', 'public');
        $banner = Banner::create([
            'title' => $request->title,
            'image' => $imagePath,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
        ]);
        
        return response()->json($banner, 201);
    }
    
    public function show($id)
    {
        return Banner::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('banners', 'public');
            $banner->image = $imagePath;
        }

        $banner->update($request->except('image'));
        return response()->json($banner);
    }
    
    public function destroy($id)
    {
        Banner::findOrFail($id)->delete();
        return response()->json(['message' => 'Banner deleted']);
    }
}

