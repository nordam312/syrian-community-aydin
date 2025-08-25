<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $fillable = [
        'home_title',
        'home_description',
        'about_title',
        'about_content',
        'contact_email',
        'contact_phone',
        'contact_address',
        'social_facebook',
        'social_instagram',
        'social_telegram'
    ];

    // الحصول على المحتوى أو إنشاؤه إذا لم يكن موجوداً
    public static function getContent()
    {
        return static::firstOrCreate();
    }

    // تحديث المحتوى
    public function updateContent($data)
    {
        $this->update($data);
        return $this;
    }
}