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
        // تحديث فوري للانتخابات المنتهية
        Election::where('status', 'active')
               ->where('end_date', '<', now())
               ->update(['status' => 'completed']);

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

            // إنشاء الانتخابات مع معالجة التوقيت
            $election = Election::create([
                'name' => $request->name,
                'description' => $request->description,
                'start_date' => $request->start_date ? \Carbon\Carbon::parse($request->start_date)->setTimezone('Europe/Istanbul') : null,
                'end_date' => $request->end_date ? \Carbon\Carbon::parse($request->end_date)->setTimezone('Europe/Istanbul') : null,
                'status' => $request->status ?? 'pending',
                'image' => $imagePath ?? null,

            ]);

            return response()->json($election, 201); // 201 = تم الإنشاء بنجاح

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Election creation failed: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'error' => 'حدث خطأ أثناء إنشاء الانتخابات',
                'message' => 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم'
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
        $election->start_date = $request->start_date ? \Carbon\Carbon::parse($request->start_date)->setTimezone('Europe/Istanbul') : $election->start_date;
        $election->end_date = $request->end_date ? \Carbon\Carbon::parse($request->end_date)->setTimezone('Europe/Istanbul') : $election->end_date;
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
        $election = Election::find($electionId);
        
        if (!$election) {
            return response()->json(['error' => 'الانتخابات غير موجودة'], 404);
        }

        // جلب المرشحين مع عدد الأصوات والمعلومات الخاصة بالمستخدم
        $candidates = Candidate::where('election_id', $electionId)
                    ->with('user:id,name')
                    ->withCount('votes') // عدد الأصوات
                    ->get();

        return response()->json($candidates);
    }

    // 🔹 إضافة مرشح إلى انتخابات
    public function addCandidate(Request $request, $electionId)
{
    $request->validate([
        'display_name' => 'required|string|max:255',
        'student_id' => 'required|exists:users,student_id',
        'position' => 'required|string',
        'bio' => 'nullable|string',
        'platform' => 'nullable|string',
        'image' => 'nullable|image|max:2048', // تحقق من أن الملف صورة وحجمها لا يتجاوز 2 ميجابايت

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
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('candidates', 'public');
    }

    $candidate = Candidate::create([
        'display_name' => $request->display_name,
        'student_id' => $request->student_id,
        'election_id' => $electionId,
        'user_id' => $user->id,
        'position' => $request->position,
        'bio' => $request->bio,
        'platform' => $request->platform,
        'image' => $imagePath ?? null
    ]);

    return response()->json($candidate, 201);
}
    // تعديل معلومات مرشح
    public function updateCandidate(Request $request, Candidate $candidate){
    $request->validate([
        'display_name' => 'nullable|string|max:255',
        'position' => 'nullable|string',
        'bio' => 'nullable|string',
        'platform' => 'nullable|string',
        'image' => 'nullable|image|max:2048',
    ]);

    // تصحيح: استخدام الخصائص الصحيحة لكائن Candidate
    $candidate->display_name = $request->display_name ?? $candidate->display_name;
    $candidate->position = $request->position ?? $candidate->position;
    $candidate->bio = $request->bio ?? $candidate->bio;
    $candidate->platform = $request->platform ?? $candidate->platform;
    
    // التعامل مع الصورة
    if ($request->hasFile('image')) {
        // إذا كان عنده صورة قديمة نحذفها
        if ($candidate->image && \Storage::disk('public')->exists($candidate->image)) {
            \Storage::disk('public')->delete($candidate->image);
        }

        $file = $request->file('image');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('candidates', $filename, 'public'); 
        $candidate->image = $path;
    }

    $candidate->save();
    
    return response()->json([
        'message' => 'تم تحديث معلوملت المرشح بنجاح',
        'candidate' => $candidate
    ]);
}
    //حذف مرشح 
    public function destroyCandidate(Candidate $candidate)
    {
        // حذف الصورة إذا كانت موجودة
        if ($candidate->image && \Storage::disk('public')->exists($candidate->image)) {
            \Storage::disk('public')->delete($candidate->image);
        }

        $candidate->delete();

        return response()->json([
            'message' => 'تم حذف المرشح بنجاح'
        ]);
    }
    
    // 🔹 التصويت لمرشح
    public function vote(Request $request, $electionId)
    {
        // التحقق من صحة المدخلات
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id,election_id,' . $electionId
        ]);

        // جلب معلومات الانتخاب للتحقق من الحالة والتاريخ
        $election = Election::findOrFail($electionId);

        // التحقق من حالة الانتخاب
        if ($election->status !== 'active') {
            return response()->json(['error' => 'هذه الانتخابات غير نشطة حالياً'], 400);
        }

        // التحقق من انتهاء موعد التصويت
        if ($election->end_date && $election->end_date < now()) {
            return response()->json(['error' => 'انتهت فترة التصويت لهذه الانتخابات'], 400);
        }

        // التحقق من بداية موعد التصويت
        if ($election->start_date && $election->start_date > now()) {
            return response()->json(['error' => 'لم تبدأ فترة التصويت لهذه الانتخابات بعد'], 400);
        }

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