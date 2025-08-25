<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // البحث
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('student_id', 'like', '%' . $request->search . '%');
            });
        }

        // التصفية حسب التخصص
        if ($request->major) {
            $query->where('major', $request->major);
        }

        // التصفية حسب السنة الدراسية
        if ($request->academic_year) {
            $query->where('academic_year', $request->academic_year);
        }

        // الترتيب
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($request->per_page ?? 15);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'student_id' => ['required', 'regex:/^b\d{4}\.\d{6}$/', 'unique:users'],
            'phone' => 'nullable|string|max:20',
            'major' => 'nullable|string|max:100',
            'academic_year' => 'nullable|string|max:20',
            'role' => 'nullable|string|in:user,admin'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'student_id' => $request->student_id,
            'phone' => $request->phone,
            'major' => $request->major,
            'academic_year' => $request->academic_year,
            'role' => $request->role ?? 'user'
        ]);

        return response()->json([
            'message' => 'تم إنشاء العضو بنجاح',
            'user' => $user
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load(['events', 'posts']));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
            'student_id' => ['sometimes', 'required', 'regex:/^b\d{4}\.\d{6}$/', 'unique:users,student_id,' . $user->id],
            'phone' => 'nullable|string|max:20',
            'major' => 'nullable|string|max:100',
            'academic_year' => 'nullable|string|max:20',
            'role' => 'nullable|string|in:user,admin'
        ]);

        $user->update($request->only([
            'name',
            'email',
            'student_id',
            'phone',
            'major',
            'academic_year',
            'role'
        ]));

        return response()->json([
            'message' => 'تم تحديث بيانات العضو بنجاح',
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'تم حذف العضو بنجاح'
        ]);
    }

    public function stats()
    {
        $stats = [
            'total_users' => User::count(),
            'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'users_by_major' => User::select('major', DB::raw('count(*) as count'))
                ->whereNotNull('major')
                ->groupBy('major')
                ->get(),
            'users_by_academic_year' => User::select('academic_year', DB::raw('count(*) as count'))
                ->whereNotNull('academic_year')
                ->groupBy('academic_year')
                ->orderBy('academic_year')
                ->get(),
            'recent_users' => User::latest()->take(5)->get()
        ];

        return response()->json($stats);
    }
}