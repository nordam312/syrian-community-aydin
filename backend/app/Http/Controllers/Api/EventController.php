<?php

namespace App\Http\Controllers\Api;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query();

        // التصفية حسب الحالة
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // التصفية حسب التاريخ
        if ($request->date_from) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('date', '<=', $request->date_to);
        }

        // البحث
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // الترتيب
        $sortBy = $request->sort_by ?? 'date';
        $sortOrder = $request->sort_order ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->with('attendees')->paginate($request->per_page ?? 15);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date|after:now',
            'location' => 'nullable|string|max:255',
            'max_attendees' => 'nullable|integer|min:1',
            'status' => 'nullable|string|in:active,cancelled,completed',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        $data = $request->except('image');
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event = Event::create($data);

        return response()->json([
            'message' => 'تم إنشاء الفعالية بنجاح',
            'event' => $event
        ], 201);
    }

    public function show(Event $event)
    {
        // جلب الحضور بدون الأدمن
        $event->setRelation(
            'attendees',
            $event->attendees
        );
        
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'location' => 'nullable|string|max:255',
            'max_attendees' => 'nullable|integer|min:1',
            'status' => 'nullable|string|in:active,cancelled,completed',
            'image' => 'nullable|string'
        ]);

        $event->update($request->all());

        return response()->json([
            'message' => 'تم تحديث الفعالية بنجاح',
            'event' => $event
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json([
            'message' => 'تم حذف الفعالية بنجاح'
        ]);
    }

    public function addAttendee(Request $request, Event $event)
    {
        // 🔥 إزالة التحقق من user_id لأنه سيعتمد على المستخدم المصادق
        $request->validate([
            'status' => 'nullable|string|in:confirmed,pending,cancelled',
            'notes' => 'nullable|string'
        ]);

        // 🔥 الحصول على المستخدم المصادق تلقائياً
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        // التحقق من إمكانية التسجيل
        if (!$event->canRegister()) {
            return response()->json([
                'message' => 'لا يمكن التسجيل في هذه الفعالية'
            ], 400);
        }

        // التحقق من عدم التسجيل مسبقاً
        if ($event->attendees()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'أنت مسجل بالفعل في هذه الفعالية'
            ], 400);
        }

        $event->attendees()->attach($user->id, [
            'status' => $request->status ?? 'confirmed',
            'notes' => $request->notes
        ]);

    return response()->json([
        'message' => 'تم التسجيل في الفعالية بنجاح'
    ]);
}

    public function removeAttendee(Request $request, Event $event)
    {
        // 🔥 الحصول على المستخدم المصادق تلقائياً
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        $event->attendees()->detach($user->id);

        return response()->json([
            'message' => 'تم إلغاء التسجيل من الفعالية بنجاح'
        ]);
    }

    public function updateAttendeeStatus(Request $request, Event $event)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string|in:confirmed,pending,cancelled',
            'notes' => 'nullable|string'
        ]);

        $event->attendees()->updateExistingPivot($request->user_id, [
            'status' => $request->status,
            'notes' => $request->notes
        ]);

        return response()->json([
            'message' => 'تم تحديث حالة التسجيل بنجاح'
        ]);
    }
    public function attendees(Event $event)
    {
        $attendees = $event->attendees()->where('role', '!=', 'admin')->get();
        // جلب الحضور مع بياناتهم
        return response()->json([
            'data' => $attendees
        ]);
    }
}