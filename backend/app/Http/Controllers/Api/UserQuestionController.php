<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserQuestionController extends Controller
{
public function index(Request $request): JsonResponse
    {

        
    try {        
        $questions = UserQuestion::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($questions);
    } catch (\Exception $e) {
        \Log::error('Error fetching user questions: ' . $e->getMessage());
        return response()->json([
            'message' => 'حدث خطأ في جلب البيانات',
            'error' => $e->getMessage()
        ], 500);
    }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
        'question' => 'required|string|max:1000',
        'is_public' => 'sometimes|boolean'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }

    // المستخدم مسجل مسبقاً بسبب middleware
    $questionData = [
        'question' => $request->question,
        'user_id' => Auth::id(), // راح يكون موجود
        'status' => 'pending',
        'is_public' => $request->get('is_public', true)
    ];

    $question = UserQuestion::create($questionData);

    return response()->json($question, 201);
    }

    public function vote(Request $request, $id): JsonResponse
    {
        $question = UserQuestion::findOrFail($id);
        
        $validated = $request->validate([
            'type' => 'required|in:like,dislike'
        ]);

        if ($validated['type'] === 'like') {
            $question->increment('likes');
        } else {
            $question->increment('dislikes');
        }

        return response()->json($question);
    }
    public function adminDestroy($id): JsonResponse
    {
        try {
            $question = UserQuestion::findOrFail($id);
            $question->delete();
            
            return response()->json(['message' => 'تم حذف السؤال بنجاح']);
        } catch (\Exception $e) {
            \Log::error('Error deleting question: ' . $e->getMessage());
            return response()->json([
                'message' => 'حدث خطأ أثناء حذف السؤال',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // للإدارة - الحصول على جميع الأسئلة
    public function adminIndex(Request $request): JsonResponse
    {
        $questions = UserQuestion::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($questions);
    }

    // للإدارة - الرد على سؤال
    public function adminAnswer(Request $request, $id): JsonResponse
    {
        $question = UserQuestion::findOrFail($id);

        $validated = $request->validate([
            'answer' => 'required|string',
            'is_public' => 'sometimes|boolean'
        ]);

        $question->update([
            'answer' => $validated['answer'],
            'status' => 'answered',
            'is_public' => $validated['is_public'] ?? $question->is_public
        ]);

        // هنا يمكنك إضافة إرسال إيميل للمستخدم بالإجابة

        return response()->json($question);
    }
}
