<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BannerController extends Controller
{
    public function __construct()
    {
        // Middleware is handled at route level - no need for controller middleware
    }

    public function index()
    {
        // For public viewing - only active banners
        return Banner::where('is_active', true)->get();
    }

    public function adminIndex()
    {
        // For admin panel - show all banners
        return Banner::all();
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
            'image' => 'required|image'
        ]);
        
        // Secure file upload with sanitized filename
        $file = $request->file('image');
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        $imagePath = $file->storeAs('banners', $filename, 'public');
        
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
        
        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
            'image' => 'nullable|image'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($banner->image) {
                Storage::disk('public')->delete($banner->image);
            }
            
            // Secure file upload with sanitized filename
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;
            $imagePath = $file->storeAs('banners', $filename, 'public');
            $banner->image = $imagePath;
        }

        $banner->update($request->only(['title', 'description', 'is_active']));
        return response()->json($banner);
    }
    
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        
        // Delete image file from storage
        if ($banner->image) {
            Storage::disk('public')->delete($banner->image);
        }
        
        $banner->delete();
        return response()->json(['message' => 'Banner deleted successfully']);
    }
}

