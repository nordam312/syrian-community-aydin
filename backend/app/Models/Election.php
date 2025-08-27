<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Election extends Model
{
    use HasFactory;

    // الحقول التي يُسمح بتحديثها بالجملة (Mass Assignment)
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'status'];

    protected $casts = [
    'start_date' => 'datetime',
    'end_date'   => 'datetime',
];

    // علاقة: Election → العديد من المرشحين
    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }

    // علاقة: Election → العديد من الأصوات
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}