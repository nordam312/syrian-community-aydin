<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Event;
use App\Models\Post;
use App\Models\Request as UserRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_users' => User::count(),
            'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'total_events' => Event::count(),
            'upcoming_events' => Event::upcoming()->count(),
            'total_posts' => Post::count(),
            'pending_requests' => UserRequest::pending()->count(),
            'recent_users' => User::latest()->take(5)->get(),
            'upcoming_events_list' => Event::upcoming()
                ->orderBy('date')
                ->take(3)
                ->get(),
            'users_by_major' => User::select('major', DB::raw('count(*) as count'))
                ->whereNotNull('major')
                ->groupBy('major')
                ->get(),
            'events_by_status' => Event::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get(),
            'monthly_registrations' => $this->getMonthlyRegistrations(),
            'recent_activities' => $this->getRecentActivities()
        ];

        return response()->json($stats);
    }

    private function getMonthlyRegistrations()
    {
        return User::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('count(*) as count')
        )
            ->whereYear('created_at', now()->year)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
    }

    private function getRecentActivities()
    {
        $activities = collect();

        // آخر المستخدمين المسجلين
        $recentUsers = User::latest()->take(3)->get();
        foreach ($recentUsers as $user) {
            $activities->push([
                'type' => 'user_registration',
                'title' => 'انضم عضو جديد',
                'description' => $user->name . ' انضم للمجتمع',
                'date' => $user->created_at,
                'user' => $user
            ]);
        }

        // آخر الفعاليات المضافة
        $recentEvents = Event::latest()->take(3)->get();
        foreach ($recentEvents as $event) {
            $activities->push([
                'type' => 'event_created',
                'title' => 'فعالية جديدة',
                'description' => 'تم إنشاء فعالية: ' . $event->title,
                'date' => $event->created_at,
                'event' => $event
            ]);
        }

        // آخر المنشورات
        $recentPosts = Post::latest()->take(3)->get();
        foreach ($recentPosts as $post) {
            $activities->push([
                'type' => 'post_created',
                'title' => 'منشور جديد',
                'description' => 'تم نشر: ' . $post->title,
                'date' => $post->created_at,
                'post' => $post
            ]);
        }

        return $activities->sortByDesc('date')->take(10)->values();
    }

    public function userStats()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::whereHas('events')->count(),
            'users_by_role' => User::select('role', DB::raw('count(*) as count'))
                ->groupBy('role')
                ->get(),
            'users_by_major' => User::select('major', DB::raw('count(*) as count'))
                ->whereNotNull('major')
                ->groupBy('major')
                ->get(),
            'users_by_academic_year' => User::select('academic_year', DB::raw('count(*) as count'))
                ->whereNotNull('academic_year')
                ->groupBy('academic_year')
                ->orderBy('academic_year')
                ->get(),
            'registration_trend' => $this->getRegistrationTrend()
        ];

        return response()->json($stats);
    }

    private function getRegistrationTrend()
    {
        return User::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->whereDate('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function eventStats()
    {
        $stats = [
            'total_events' => Event::count(),
            'active_events' => Event::active()->count(),
            'upcoming_events' => Event::upcoming()->count(),
            'events_by_status' => Event::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get(),
            'total_attendees' => DB::table('event_attendees')->count(),
            'confirmed_attendees' => DB::table('event_attendees')
                ->where('status', 'confirmed')
                ->count(),
            'popular_events' => Event::withCount('attendees')
                ->orderBy('attendees_count', 'desc')
                ->take(5)
                ->get()
        ];

        return response()->json($stats);
    }
}