<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Member::with('user')->active()->ordered();

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        // Filter by leadership
        if ($request->has('is_leader')) {
            $query->where('is_leader', filter_var($request->is_leader, FILTER_VALIDATE_BOOLEAN));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('major', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'student_id' => 'required|string|exists:users,student_id',
            'role' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif,bmp,svg,webp',
            'is_leader' => 'boolean',
            'is_active' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        // Find user by student_id
        $user = User::where('student_id', $validated['student_id'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found with this student ID'], 404);
        }

        // Check if member already exists for this user
        if (Member::where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Member profile already exists for this user'], 409);
        }

        DB::beginTransaction();
        try {
            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('members', 'public');
            }

            // Create member
            $member = Member::create([
                'user_id' => $user->id,
                'student_id' => $user->student_id,
                'name' => $user->name,
                'role' => $validated['role'],
                'department' => $validated['department'] ?? null,
                'major' => $user->major,
                'year' => $user->academic_year,
                'instagram' => $validated['instagram'] ?? null,
                'image' => $imagePath,
                'is_leader' => $validated['is_leader'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'display_order' => $validated['display_order'] ?? 0,
            ]);

            DB::commit();
            return response()->json($member->load('user'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            return response()->json(['message' => 'Failed to create member'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $member = Member::with('user')->findOrFail($id);
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);

        // Validate request
        $validated = $request->validate([
            'role' => 'string|max:255',
            'department' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif,bmp,svg,webp',
            'is_leader' => 'boolean',
            'is_active' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($member->image) {
                    Storage::disk('public')->delete($member->image);
                }
                $validated['image'] = $request->file('image')->store('members', 'public');
            }

            // Update member
            $member->update($validated);

            DB::commit();
            return response()->json($member->load('user'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update member'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $member = Member::findOrFail($id);

        DB::beginTransaction();
        try {
            // Delete image if exists
            if ($member->image) {
                Storage::disk('public')->delete($member->image);
            }

            $member->delete();

            DB::commit();
            return response()->json(['message' => 'Member deleted successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete member'], 500);
        }
    }

    /**
     * Get statistics about members
     */
    public function statistics()
    {
        $stats = [
            'total_members' => Member::count(),
            'active_members' => Member::where('is_active', true)->count(),
            'leaders' => Member::where('is_leader', true)->count(),
            'departments' => Member::whereNotNull('department')->distinct('department')->count(),
        ];

        return response()->json($stats);
    }
}
