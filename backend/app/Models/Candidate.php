<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    // الحقول التي يُسمح بتحديثها بالجملة
    protected $fillable = ['election_id', 'user_id', 'position', 'bio', 'platform'];

    // علاقة: Candidate ← الانتخاب
    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    // علاقة: Candidate ← المستخدم (المرشح هو مستخدم)
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    // علاقة: Candidate → العديد من الأصوات
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}