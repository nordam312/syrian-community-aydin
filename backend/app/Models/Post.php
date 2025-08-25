<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'image',
        'status',
        'user_id',
        'category',
        'views'
    ];

    // العلاقة مع المستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // نطاق المنشورات المنشورة
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    // زيادة عدد المشاهدات
    public function incrementViews()
    {
        $this->increment('views');
    }

    // نطاق المنشورات حسب الفئة
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}