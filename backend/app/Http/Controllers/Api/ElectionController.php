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
    // 🔹 إنشاء انتخابات جديدة
    public function store(Request $request)
    {
        try {
            // التحقق من المدخلات
            $request->validate([
                'name' => 'required|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'status' => 'in:pending,active,completed'
            ]);

            // إنشاء الانتخابات
            $election = Election::create([
                'name' => $request->name,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status ?? 'pending',
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
    public function addCandidate(Request $request, $electionId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'required|string',
            'bio' => 'nullable|string',
            'platform' => 'nullable|string',
        ]);

        $candidate = Candidate::create([
            'election_id' => $electionId,
            'user_id' => $request->user_id,
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