<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class LogoController extends Controller
{
    /**
     * Display a listing of the logos.
     */
    public function index()
    {
        $logos = Logo::orderBy('created_at', 'desc')->get();
        return response()->json($logos);
    }

    public function show(Logo $logo)
    {
        return response()->json($logo);
    }

    /**
     * Display the active logo.
     */
    public function active()
    {
        $logo = Logo::where('is_active', true)->first();

        if (!$logo) {
            return response()->json(['message' => 'No active logo found'], 404);
        }

        return response()->json($logo);
    }

    /**
     * Store a newly created logo.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048|dimensions:max_width=2000,max_height=2000',
            'alt_text' => 'nullable|string|max:255',
            'position' => 'nullable|in:header,footer,mobile',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle image upload with secure filename
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;
            $imagePath = $file->storeAs('logos', $filename, 'public');

            // Get image dimensions
            $imageInfo = getimagesize(storage_path('app/public/' . $imagePath));
            $width = $imageInfo[0] ?? null;
            $height = $imageInfo[1] ?? null;

            // Deactivate other logos if this is the header logo
            if ($request->position === 'header') {
                Logo::where('position', 'header')->update(['is_active' => false]);
            }

            $logo = Logo::create([
                'name' => $request->name,
                'image_path' => $imagePath,
                'alt_text' => $request->alt_text,
                'width' => $width,
                'height' => $height,
                'position' => $request->position ?? 'header',
                'is_active' => true,
            ]);

            return response()->json([
                'message' => 'Logo uploaded successfully',
                'logo' => $logo
            ], 201);

        } catch (\Exception $e) {
            // Log the error for debugging but don't expose details to user
            \Log::error('Logo upload failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error uploading logo'
            ], 500);
        }
    }

    /**
     * Update the specified logo.
     */
public function update(Request $request, Logo $logo)
{
    $validator = Validator::make($request->all(), [
        'name' => 'nullable|string|max:255',
        'image_path' => 'nullable|image|mimes:jpeg,png,jpg|max:2048|dimensions:max_width=2000,max_height=2000',
        'alt_text' => 'nullable|string|max:255',
        'position' => 'nullable|in:header,footer,mobile',
        'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // نسحب كل الحقول الممكن تعديلها
        $updateData = $request->only(['name', 'alt_text', 'position', 'is_active']);

        // الصورة
        if ($request->hasFile('image_path')) {
            if ($logo->image_path) {
                Storage::disk('public')->delete($logo->image_path);
            }

            // Secure file upload with sanitized filename
            $file = $request->file('image_path');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;
            $imagePath = $file->storeAs('logos', $filename, 'public');
            $updateData['image_path'] = $imagePath;

            $imageInfo = getimagesize(storage_path('app/public/' . $imagePath));
            $updateData['width'] = $imageInfo[0] ?? null;
            $updateData['height'] = $imageInfo[1] ?? null;
        }

        // التفعيل
        if ($request->has('is_active') && filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)) {
            Logo::where('position', $logo->position)
                ->where('id', '!=', $logo->id)
                ->update(['is_active' => false]);
        }

        $logo->update($updateData);

        return response()->json([
            'message' => 'Logo updated successfully',
            'logo' => $logo
        ]);

    } catch (\Exception $e) {
        // Log the error for debugging but don't expose details to user
        \Log::error('Logo update failed: ' . $e->getMessage());
        
        return response()->json([
            'message' => 'Error updating logo'
        ], 500);
    }
}

    /**
     * Remove the specified logo.
     */
    public function destroy(Logo $logo)
    {
        try {
            // Delete image file
            if ($logo->image_path) {
                Storage::disk('public')->delete($logo->image_path);
            }

            $logo->delete();

            return response()->json([
                'message' => 'Logo deleted successfully'
            ]);

        } catch (\Exception $e) {
            // Log the error for debugging but don't expose details to user
            \Log::error('Logo deletion failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error deleting logo'
            ], 500);
        }
    }
}
