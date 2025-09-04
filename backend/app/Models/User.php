<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'student_id',    // أضف هذه الحقول
        'phone',
        'major',
        'academic_year',
        'verification_token',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // العلاقة مع الفعاليات التي يشارك فيها
    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_attendees')
            ->withPivot('status', 'notes')
            ->withTimestamps();
    }

    // العلاقة مع المنشورات
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // العلاقة مع الطلبات المقدمة
    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    // العلاقة مع الطلبات المعينة له
    public function assignedRequests()
    {
        return $this->hasMany(Request::class, 'assigned_to');
    }

    // التحقق من كون المستخدم مسؤول
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    // الحصول على عدد الفعاليات المشارك فيها
    public function getEventsCountAttribute()
    {
        return $this->events()->wherePivot('status', 'confirmed')->count();
    }
}
