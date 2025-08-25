<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
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
            // Handle image upload
            $imagePath = $request->file('image')->store('logos', 'public');

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
            return response()->json([
                'message' => 'Error uploading logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified logo.
     */
    public function update(Request $request, Logo $logo)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
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
            $updateData = $request->only(['name', 'alt_text', 'position', 'is_active']);

            // Handle image update
            if ($request->hasFile('image')) {
                // Delete old image
                if ($logo->image_path) {
                    Storage::disk('public')->delete($logo->image_path);
                }

                $imagePath = $request->file('image')->store('logos', 'public');
                $updateData['image_path'] = $imagePath;

                // Update dimensions
                $imageInfo = getimagesize(storage_path('app/public/' . $imagePath));
                $updateData['width'] = $imageInfo[0] ?? null;
                $updateData['height'] = $imageInfo[1] ?? null;
            }

            // Handle activation/deactivation
            if ($request->has('is_active') && $request->is_active) {
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
            return response()->json([
                'message' => 'Error updating logo',
                'error' => $e->getMessage()
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
            return response()->json([
                'message' => 'Error deleting logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
