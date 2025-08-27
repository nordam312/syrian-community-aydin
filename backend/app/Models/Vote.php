<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    // الحقول التي يُسمح بتحديثها بالجملة
    protected $fillable = ['election_id', 'user_id', 'candidate_id'];

    // علاقة: Vote ← الانتخاب
    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    // علاقة: Vote ← المستخدم
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    // علاقة: Vote ← المرشح
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}