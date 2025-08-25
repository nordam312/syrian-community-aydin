<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'description',
        'status',
        'user_id',
        'assigned_to',
        'admin_notes',
        'processed_at'
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    // العلاقة مع المستخدم الذي قدم الطلب
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // العلاقة مع المسؤول المعين
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // نطاق الطلبات المعلقة
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // نطاق الطلبات حسب النوع
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // معالجة الطلب
    public function process($status, $notes = null, $assignedTo = null)
    {
        $this->update([
            'status' => $status,
            'admin_notes' => $notes,
            'assigned_to' => $assignedTo,
            'processed_at' => now()
        ]);
    }
}