<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date',
        'location',
        'max_attendees',
        'status',
        'image',
        'one_day_reminder_sent',
        'two_hour_reminder_sent'
    ];



    protected $casts = [
        'date' => 'datetime',
    ];

    protected $appends = ['confirmed_attendees_count', 'remaining_slots'];

    // العلاقة مع المشاركين
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_attendees')
            ->withPivot('status', 'notes')
            ->withTimestamps();
    }

    // عدد المشاركين المؤكدين
    public function getConfirmedAttendeesCountAttribute(): int
    {
        return $this->attendees()->wherePivot('status', 'confirmed')->count();
    }
    // حساب الأماكن المتبقية
    public function getRemainingSlotsAttribute(): float|int
    {
        return $this->max_attendees - $this->confirmed_attendees_count;
    }

    // التحقق من إمكانية التسجيل
    public function canRegister()
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->max_attendees && $this->confirmed_attendees_count >= $this->max_attendees) {
            return false;
        }

        return true;
    }

    // نطاق الفعاليات النشطة
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // نطاق الفعاليات القادمة
    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now())->where('status', 'active');
    }
}