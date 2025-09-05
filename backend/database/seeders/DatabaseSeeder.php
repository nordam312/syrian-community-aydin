<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Content;
use App\Models\Setting;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@syriancommunity.com',
            'password' => Hash::make('2278434'),
            'student_id' => 'b2180.060001',
            'role' => 'admin',
            'major' => 'إدارة الموقع',
            'academic_year' => '4'
        ]);

        // إنشاء محتوى افتراضي
        Content::create([
            'home_title' => 'المجتمع السوري في أيدن',
            'home_description' => 'مرحباً بكم في المجتمع السوري في أيدن. نحن مجتمع داعم للطلاب السوريين في مدينة أيدن التركية، نسعى لتوفير بيئة تعليمية واجتماعية مريحة ومفيدة.',
            'about_title' => 'من نحن',
            'about_content' => 'المجتمع السوري في أيدن هو منظمة طلابية غير ربحية تأسست لدعم الطلاب السوريين في مدينة أيدن. نحن نعمل على توفير الدعم الأكاديمي والاجتماعي والثقافي للطلاب السوريين.',
            'contact_email' => 'info@syriancommunity.com',
            'contact_phone' => '+90 555 123 4567',
            'contact_address' => 'أيدن، تركيا',
            'social_facebook' => 'https://facebook.com/syriancommunityaydin',
            'social_instagram' => 'https://instagram.com/syriancommunityaydin',
            'social_telegram' => 'https://t.me/syriancommunityaydin'
        ]);

        // إنشاء إعدادات افتراضية
        $defaultSettings = [
            ['key' => 'site_name', 'value' => 'المجتمع السوري في أيدن', 'type' => 'string', 'group' => 'site'],
            ['key' => 'site_description', 'value' => 'مجتمع داعم للطلاب السوريين في أيدن', 'type' => 'string', 'group' => 'site'],
            ['key' => 'enable_registration', 'value' => 'true', 'type' => 'boolean', 'group' => 'security'],
            ['key' => 'email_verification', 'value' => 'false', 'type' => 'boolean', 'group' => 'security'],
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'group' => 'site'],
            ['key' => 'max_events_per_user', 'value' => '5', 'type' => 'integer', 'group' => 'events'],
            ['key' => 'auto_approve_events', 'value' => 'true', 'type' => 'boolean', 'group' => 'events']
        ];

        foreach ($defaultSettings as $setting) {
            Setting::create($setting);
        }

        // إنشاء فعاليات تجريبية
        Event::create([
            'title' => 'لقاء تعريفي بالجامعة',
            'description' => 'لقاء تعريفي للطلاب الجدد للتعرف على الجامعة والمرافق المتاحة',
            'date' => now()->addDays(7),
            'location' => 'قاعة المؤتمرات - الجامعة',
            'max_attendees' => 50,
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'ورشة عمل في البرمجة',
            'description' => 'ورشة عمل مجانية في أساسيات البرمجة للطلاب المهتمين',
            'date' => now()->addDays(14),
            'location' => 'مختبر الحاسوب - كلية الهندسة',
            'max_attendees' => 30,
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'رحلة ترفيهية',
            'description' => 'رحلة ترفيهية للطلاب للتعرف على معالم مدينة أيدن',
            'date' => now()->addDays(21),
            'location' => 'مركز المدينة',
            'max_attendees' => 40,
            'status' => 'active'
        ]);

        // إنشاء مستخدمين تجريبيين
        $users = [
            [
                'name' => 'أحمد محمد',
                'email' => 'ahmed@example.com',
                'password' => Hash::make('password'),
                'student_id' => 'b2180.060001',
                'major' => 'علوم حاسوب',
                'academic_year' => '2'
            ],
            [
                'name' => 'فاطمة علي',
                'email' => 'fatima@example.com',
                'password' => Hash::make('password'),
                'student_id' => 'b2180.060002',
                'major' => 'هندسة مدنية',
                'academic_year' => '3'
            ],
            [
                'name' => 'محمد حسن',
                'email' => 'mohammed@example.com',
                'password' => Hash::make('password'),
                'student_id' => 'b2180.060003',
                'major' => 'إدارة أعمال',
                'academic_year' => '1'
            ]
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
