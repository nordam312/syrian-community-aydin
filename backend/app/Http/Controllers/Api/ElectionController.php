<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\Vote;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ElectionController extends Controller
{


    // 🔹 عرض جميع الانتخابات
    public function index()
    {
    $elections = Election::withCount('candidates') // يحسب عدد المرشحين
                ->withCount('votes')      // يحسب عدد الأصوات (إذا عندك علاقة votes بالانتخابات)
                ->get();
        return response()->json($elections);
    }
    // 🔹 إنشاء انتخابات جديدة
    public function store(Request $request)
    {
        try {
            // التحقق من المدخلات
            $request->validate([
                'name' => 'required|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'status' => 'in:pending,active,completed',
                'image' => 'nullable|image|max:2048', // تحقق من أن الملف صورة وحجمها لا يتجاوز 2 ميجابايت

            ]);

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('elections', 'public');
            }

            // إنشاء الانتخابات
            $election = Election::create([
                'name' => $request->name,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status ?? 'pending',
                'image' => $imagePath ?? null,

            ]);

            return response()->json($election, 201); // 201 = تم الإنشاء بنجاح

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
            'error' => 'حدث خطأ',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
}

    }
    //تحديث حملة انتخابية
    public function updateElection(Request $request, Election $election){
        $request->validate([
            'name' => "nullable|string|max:255",
            'description' => "nullable|string",
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'in:pending,active,completed',
            'image' => 'nullable|image|max:2048'
        ]);

        // تحديث الحقول العادية
        $election->name = $request->name ?? $election->name;
        $election->description = $request->description ?? $election->description;
        $election->start_date = $request->start_date ?? $election->start_date;
        $election->end_date = $request->end_date ?? $election->end_date;
        $election->status = $request->status ?? $election->status;

        // التعامل مع الصورة
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('elections', $filename, 'public'); // يخزن في storage/app/public/elections
            $election->image = $path; // نخزن المسار النهائي في الداتابيس
        }

        $election->save();

        return response()->json([
            'message' => 'تم تحديث الفعالية بنجاح',
            'event' => $election
        ]);
    }

    // حذف حملة انتخابية 
        public function destroyElection($id)
    {
        Election::findOrFail($id)->delete();
        return response()->json(['message' => 'تم حذف الحملة الانتخابية بنجاح']);
    }
    // 🔹 عرض المرشحين لانتخابات معينة
    public function candidates(Request $request, $electionId)
    {
        $election = Election::with('candidates.user:id,name')->find($electionId);
        if (!$election) {
            return response()->json(['error' => 'الانتخابات غير موجودة'], 404);
        }

        return response()->json($election->candidates);
    }

    // 🔹 إضافة مرشح إلى انتخابات
    // public function addCandidate(Request $request, $electionId)
    // {
    //     $request->validate([
    //         'user_id' => 'required|exists:users,id',
    //         'position' => 'required|string',
    //         'bio' => 'nullable|string',
    //         'platform' => 'nullable|string',
    //     ]);

    //     $candidate = Candidate::create([
    //         'election_id' => $electionId,
    //         'user_id' => $request->user_id,
    //         'position' => $request->position,
    //         'bio' => $request->bio,
    //         'platform' => $request->platform,
    //     ]);

    //     return response()->json($candidate, 201);
    // }
    public function addCandidate(Request $request, $electionId)
{
    $request->validate([
        'display_name' => 'required|string|max:255',
        'student_id' => 'required|exists:users,student_id',
        'position' => 'required|string',
        'bio' => 'nullable|string',
        'platform' => 'nullable|string',
    ], [
        'display_name.required' => 'اسم المرشح مطلوب',
        'display_name.string' => 'اسم المرشح يجب أن يكون نصاً',
        'display_name.max' => 'اسم المرشح طويل جداً',

        'student_id.required' => 'معرف الطالب مطلوب',
        'student_id.exists' => 'معرف الطالب المختار غير صالح',

        'position.required' => 'المنصب مطلوب',
        'position.string' => 'المنصب يجب أن يكون نصاً',

        'bio.string' => 'السيرة الذاتية يجب أن تكون نصاً',
        'platform.string' => 'برنامج المرشح يجب أن يكون نصاً',
    ]);


    // جلب الـ user_id من جدول users عن طريق student_number
    $user = User::where('student_id', $request->student_id)->first();


    if (!$user) {
        return response()->json(['error' => 'الطالب غير موجود'], 404);
    }

    $candidate = Candidate::create([
        'display_name' => $request->display_name,
        'student_id' => $request->student_id,
        'election_id' => $electionId,
        'user_id' => $user->id,
        'position' => $request->position,
        'bio' => $request->bio,
        'platform' => $request->platform,
    ]);

    return response()->json($candidate, 201);
}


    // 🔹 التصويت لمرشح
    public function vote(Request $request, $electionId)
    {
        // التحقق من صحة المدخلات
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id,election_id,' . $electionId
        ]);

        $userId = auth()->user()->id;

        // التحقق هل صوت هذا المستخدم من قبل؟
        if (Vote::where(['election_id' => $electionId, 'user_id' => $userId])->exists()) {
            return response()->json(['error' => 'لقد صوتت مسبقاً لهذه الانتخابات'], 400);
        }

        // عملية التصويت
        $vote = Vote::create([
            'election_id' => $electionId,
            'user_id' => $userId,
            'candidate_id' => $request->candidate_id
        ]);

        return response()->json(['message' => 'تم التصويت بنجاح']);
    }

    // 🔹 عرض نتائج الانتخابات
    public function results(Request $request, $electionId)
    {
        return Candidate::where('election_id', $electionId)
            ->withCount('votes')
            ->get();
    }
}