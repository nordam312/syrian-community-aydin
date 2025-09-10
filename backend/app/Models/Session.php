<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Session extends Model
{
    protected $table = 'sessions';

    protected $fillable = [
        'id',
        'user_id',
        'ip_address',
        'user_agent',
        'payload',
        'last_activity',
    ];

    protected $casts = [
        'last_activity' => 'integer',
    ];

    /**
     * العلاقة مع نموذج المستخدم.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * الحصول على بيانات الجلسة المفكوكة.
     */
    public function getPayloadDataAttribute()
    {
        try {
            // طريقة آمنة لفك تشفير payload الجلسة
            $payload = base64_decode($this->payload);
            if ($payload === false) {
                return [];
            }
            
            $data = unserialize($payload);
            return is_array($data) ? $data : [];
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * التحقق إذا كانت الجلسة منتهية الصلاحية.
     */
    public function getIsExpiredAttribute()
    {
        $sessionLifetime = config('session.lifetime', 120) * 60;
        return time() - $this->last_activity > $sessionLifetime;
    }

    /**
     * الحصول على وقت آخر نشاط كتاريخ.
     */
    public function getLastActivityAsDateTimeAttribute()
    {
        return Carbon::createFromTimestamp($this->last_activity);
    }
}