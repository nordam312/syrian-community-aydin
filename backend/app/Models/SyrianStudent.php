<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyrianStudent extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * التحقق من أن رقم الطالب موجود في قائمة السوريين
     */
    public static function isEligibleToVote($studentId)
    {
        return self::where('student_id', $studentId)
                   ->where('is_active', true)
                   ->exists();
    }
}